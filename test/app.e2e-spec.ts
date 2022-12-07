import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { spec, request } from 'pactum';
import { LoginDTO, RegisterDTO } from '../src/auth/dto';

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
            .expectStatus(200);
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
    describe('get current user', () => {});

    describe('edit user', () => {});
  });

  describe('bookmarks', () => {
    describe('create bookmark', () => {});

    describe('get bookmarks', () => {});

    describe('get bookmark by id', () => {});

    describe('edit bookmark', () => {});

    describe('delete bookmark', () => {});
  });
});
