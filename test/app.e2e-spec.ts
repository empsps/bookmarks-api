import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

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

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(() => app.close());

  describe('auth', () => {
    describe('register', () => {
      it.todo('should register');
    });

    describe('login', () => {
      it.todo('should login');
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
