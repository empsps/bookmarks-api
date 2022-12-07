import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { spec, request } from 'pactum';

describe('app e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => app.close());

  describe('auth', () => {
    describe('register', () => {
      it('should throw exception if email empty', () => {
        return spec()
          .post('/auth/register')
          .withBody({ username: 'test', password: 'testing' })
          .expectStatus(400);
      });

      it('should throw exception if username empty', () => {
        return spec()
          .post('/auth/register')
          .withBody({ email: 'test@test.com', password: 'testing' })
          .expectStatus(400);
      });

      it('should throw exception if password empty', () => {
        return spec()
          .post('/auth/register')
          .withBody({ email: 'test@test.com' })
          .expectStatus(400);
      });

      it('should throw exception if body empty', () => {
        return spec().post('/auth/register').expectStatus(400);
      });

      it('should throw exception if email is not valid', () => {
        return spec()
          .post('/auth/register')
          .withBody({ email: 'test@', username: 'test', password: 'testing' })
          .expectStatus(400);
      });

      it('should register a new user', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'test@test.com',
            username: 'testuser',
            password: 'testing',
          })
          .expectStatus(201);
      });

      it('should throw exception if email is already in use', () => {
        return spec()
          .post('/auth/register')
          .withBody({
            email: 'test@test.com',
            username: 'testuser',
            password: 'testing',
          })
          .expectStatus(403);
      });
    });

    describe('login', () => {
      describe('login with username', () => {
        it('should login with the test user', () => {
          return spec()
            .post('/auth/login')
            .withBody({
              credential: 'testuser',
              password: 'testing',
            })
            .expectStatus(200);
        });
      });

      describe('login with email', () => {
        it('should login with the test user', () => {
          return spec()
            .post('/auth/login')
            .withBody({
              credential: 'test@test.com',
              password: 'testing',
            })
            .expectStatus(200)
            .stores('userAccessToken', 'access_token');
        });
      });

      it('should throw exception if no credential', () => {
        return spec()
          .post('/auth/login')
          .withBody({
            password: 'testing',
          })
          .expectStatus(400);
      });

      it('should throw exception if no password', () => {
        return spec()
          .post('/auth/login')
          .withBody({
            username: 'testuser',
          })
          .expectStatus(400);
      });

      it('should throw exception if no body', () => {
        return spec().post('/auth/login').expectStatus(400);
      });
    });
  });

  describe('user', () => {
    describe('get current user', () => {
      it('should get current user', () => {
        return spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}',
          })
          .expectStatus(200);
      });
    });

    describe('edit user', () => {
      const dto = {
        firstName: 'Test',
        lastName: 'Silva',
        email: 'email@test.com',
      };

      it('should edit the user', () => {
        return spec()
          .patch('/users')
          .withBody(dto)
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName)
          .expectBodyContains(dto.email);
      });

      it('should throw if invalid email', () => {
        return spec()
          .patch('/users')
          .withBody({
            firstName: 'Test',
            lastName: 'Silva',
            email: 'email@test',
          })
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(400);
      });

      it('should throw if invalid dto', () => {
        return spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(400);
      });
    });
  });

  describe('bookmarks', () => {
    describe('create bookmark', () => {
      const dto = {
        title: 'Test',
        description: 'Testing',
        link: 'testing.com',
      };

      it('should create a new bookmark', () => {
        return spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id');
      });

      it('should throw if title missing', () => {
        return spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({
            ...dto,
            title: '',
          })
          .expectStatus(400);
      });

      it('should work if description missing', () => {
        return spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({
            ...dto,
            description: '',
          })
          .expectStatus(201);
      });

      it('should throw if link missing', () => {
        return spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({
            ...dto,
            link: '',
          })
          .expectStatus(400);
      });
    });

    describe('get bookmarks', () => {
      it('should throw if userId missing', () => {
        return spec().get('/bookmarks').expectStatus(401);
      });

      it('should get bookmarks', () => {
        return spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });

    describe('get bookmark by id', () => {
      it('should get bookmarks', () => {
        return spec()
          .get('/bookmarks/$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });

      it('should throw if no id', () => {
        return spec()
          .get('/bookmarks/a')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(400);
      });

      it('should throw if no userId', () => {
        return spec().get('/bookmarks/$S{bookmarkId}').expectStatus(401);
      });
    });

    describe('edit bookmark by id', () => {
      const dto = {
        title: 'Test2',
        description: 'Testing2',
        link: 'testing2.com',
      };

      it('should edit the bookmark', () => {
        return spec()
          .patch('/bookmarks/edit/$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link);
      });

      it('should throw if no id', () => {
        return spec()
          .patch('/bookmarks/edit/')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(404);
      });
    });

    describe('delete bookmark by id', () => {
      it('should delete the bookmark', () => {
        return spec()
          .delete('/bookmarks/delete/$S{bookmarkId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });

      it('should throw if no id', () => {
        return spec()
          .delete('/bookmarks/delete/')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(404);
      });

      it('should throw if no userId', () => {
        return spec()
          .delete('/bookmarks/delete/$S{bookmarkId}')
          .expectStatus(401);
      });
    });
  });
});
