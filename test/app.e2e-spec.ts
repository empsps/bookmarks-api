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

      it('should throw exception if email is not valid', () => {
        return spec()
          .post('/auth/register')
          .withBody({ email: 'test@', username: 'test', password: 'testing' })
          .expectStatus(400);
      });

      const dto: RegisterDTO = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'testing',
      };

      it('should register a new user', () => {
        return spec().post('/auth/register').withBody(dto).expectStatus(201);
      });
    });

    describe('login with username', () => {
      const dto: LoginDTO = {
        credential: 'testuser',
        password: 'testing',
      };
      it('should login with the test user', () => {
        return spec().post('/auth/login').withBody(dto).expectStatus(200);
      });
    });

    describe('login with email', () => {
      const dto: LoginDTO = {
        credential: 'test@test.com',
        password: 'testing',
      };
      it('should login with the test user', () => {
        return spec().post('/auth/login').withBody(dto).expectStatus(200);
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
