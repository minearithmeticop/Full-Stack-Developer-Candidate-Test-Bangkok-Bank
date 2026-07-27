import {
  INestApplication,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { JwtStrategy } from '../../src/auth/jwt.strategy';
import { PrismaService } from '../../src/prisma/prisma.service';
import { seed } from '../../prisma/seed';

@Injectable()
class MockJwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: 'mock-secret-for-testing',
    });
  }

  authenticate(req: any) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return this.fail('Token missing', 401);
    }

    const token = authHeader.replace('Bearer ', '').trim();

    if (token === 'bearer-user-a' || token === 'token-user-a') {
      return this.success({
        id: 'auth0|userA',
        sub: 'auth0|userA',
        email: 'userA@test.com',
        emailVerified: true,
      });
    }

    if (token === 'bearer-user-b' || token === 'token-user-b') {
      return this.success({
        id: 'auth0|userB',
        sub: 'auth0|userB',
        email: 'userB@test.com',
        emailVerified: true,
      });
    }

    return this.fail('Invalid test token', 401);
  }
}

describe('Multi-Tenant Data Isolation & Security Matrix (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtStrategy)
      .useClass(MockJwtStrategy)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await seed(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Multi-Tenant Data Isolation (ST-01 to ST-06 & ST-60)', () => {
    it('ST-01: User A GET bookmark of A should return 200 OK', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bookmarks/bm-user-a-1')
        .set('Authorization', 'Bearer token-user-a')
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe('bm-user-a-1');
          expect(res.body.ownerId).toBe('auth0|userA');
        });
    });

    it('ST-02: User B GET bookmark of A should return 404 Not Found', () => {
      return request(app.getHttpServer())
        .get('/api/v1/bookmarks/bm-user-a-1')
        .set('Authorization', 'Bearer token-user-b')
        .expect(404);
    });

    it('ST-03: User B PATCH bookmark of A should return 404 Not Found', () => {
      return request(app.getHttpServer())
        .patch('/api/v1/bookmarks/bm-user-a-1')
        .set('Authorization', 'Bearer token-user-b')
        .send({ title: 'Hacked Title' })
        .expect(404);
    });

    it('ST-04: User B DELETE bookmark of A should return 404 Not Found', () => {
      return request(app.getHttpServer())
        .delete('/api/v1/bookmarks/bm-user-a-1')
        .set('Authorization', 'Bearer token-user-b')
        .expect(404);
    });

    it('ST-60: User B GET collection of A should return 404 Not Found & GET /collections/all isolates data', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/collections/col-user-a-1')
        .set('Authorization', 'Bearer token-user-b')
        .expect(404);

      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/all')
        .set('Authorization', 'Bearer token-user-b')
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe('col-user-b-1');
      expect(res.body[0].ownerId).toBe('auth0|userB');
    });

    it('ST-06: User A POST bookmark with payload ownerId override should enforce server token ownerId', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bookmarks')
        .set('Authorization', 'Bearer token-user-a')
        .send({
          title: 'Secure Bangkok Bank Portal',
          url: 'https://secure.bangkokbank.com',
          ownerId: 'auth0|hacker',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.ownerId).toBe('auth0|userA');
        });
    });
  });

  describe('Cascade Delete Prevention (SetNull Strategy)', () => {
    it('Deleting collection col-user-a-2 should set collectionId=null for bookmark bm-user-a-2 without deleting it', async () => {
      await request(app.getHttpServer())
        .delete('/api/v1/collections/col-user-a-2')
        .set('Authorization', 'Bearer token-user-a')
        .expect(204);

      const res = await request(app.getHttpServer())
        .get('/api/v1/bookmarks/bm-user-a-2')
        .set('Authorization', 'Bearer token-user-a')
        .expect(200);

      expect(res.body.id).toBe('bm-user-a-2');
      expect(res.body.collectionId).toBeNull();
      expect(res.body.ownerId).toBe('auth0|userA');
    });
  });

  describe('DTO Payload Validation Guardrails & Search Criteria', () => {
    it('POST bookmark with extra non-whitelisted property should return 400 Bad Request', () => {
      return request(app.getHttpServer())
        .post('/api/v1/bookmarks')
        .set('Authorization', 'Bearer token-user-a')
        .send({
          title: 'Valid Title',
          url: 'https://example.com',
          unwhitelistedExtraField: 'maliciousPayload',
        })
        .expect(400);
    });

    it('GET /api/v1/bookmarks with search query should search ONLY title and notes, NOT url', async () => {
      // Seed user A has bookmark: title="Bangkok Bank", url="https://www.bangkokbank.com", notes="Official site"
      // Search by title "Bangkok" -> returns bookmark
      const titleRes = await request(app.getHttpServer())
        .get('/api/v1/bookmarks?search=Bangkok')
        .set('Authorization', 'Bearer token-user-a')
        .expect(200);

      expect(titleRes.body.length).toBeGreaterThan(0);
      expect(titleRes.body[0].title).toContain('Bangkok Bank');

      // Search by URL substring "bangkokbank.com" -> returns empty array because URL is excluded from search
      const urlRes = await request(app.getHttpServer())
        .get('/api/v1/bookmarks?search=bangkokbank.com')
        .set('Authorization', 'Bearer token-user-a')
        .expect(200);

      expect(urlRes.body).toHaveLength(0);
    });
  });
});
