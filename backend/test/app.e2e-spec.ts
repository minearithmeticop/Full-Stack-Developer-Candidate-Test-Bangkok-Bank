import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Security & Authentication (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Public Endpoints', () => {
    it('/health (GET) should return 200 OK without token', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body.timestamp).toBeDefined();
        });
    });
  });

  describe('Protected Endpoints Security Boundary', () => {
    it('/api/v1/me (GET) without token should return 401 Unauthorized', () => {
      return request(app.getHttpServer()).get('/api/v1/me').expect(401);
    });

    it('/api/v1/collections (GET) without token should return 401 Unauthorized', () => {
      return request(app.getHttpServer())
        .get('/api/v1/collections')
        .expect(401);
    });

    it('/api/v1/bookmarks (GET) without token should return 401 Unauthorized', () => {
      return request(app.getHttpServer()).get('/api/v1/bookmarks').expect(401);
    });
  });
});
