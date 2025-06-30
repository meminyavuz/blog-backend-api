const request = require('supertest');
const app = require('../src/app'); // Express uygulamanızın ana dosyası
const { sequelize } = require('../models'); // Sequelize bağlantısı

let token; // Kullanıcı oturum token'ı
let adminToken; // Admin oturum token'ı
let articleId; // Test için oluşturulan makale ID'si
let slug; // Test için oluşturulan makale slug'ı

beforeAll(async () => {
    // Veritabanını senkronize et
    await sequelize.sync({ force: true });
  
    // Mevcut kullanıcı bilgilerini kullanın
    const userId = '460f4aeb-db36-436e-9842-b7bdd485f547'; // Mevcut kullanıcı ID'si
    const adminId = '231bbed9-8246-4333-9ad8-abdd0534adbc'; // Mevcut admin ID'si
    const authorRoleId = '63a3db30-e125-410b-9163-d158bc3f0c2b'; // Mevcut "reader" rolü ID'si
    const adminRoleId = 'e985d994-02a6-4213-92c4-c744eadcc955'; // Mevcut "admin" rolü ID'si

    // Kullanıcı ve admin için token oluştur
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2MGY0YWViLWRiMzYtNDM2ZS05ODQyLWI3YmRkNDg1ZjU0NyIsInJvbGVJZCI6IjYzYTNkYjMwLWUxMjUtNDEwYi05MTYzLWQxNThiYzNmMGMyYiIsImlhdCI6MTc1MTI5NTg0MSwiZXhwIjoxNzUxMjk5NDQxfQ.qLkvCNDrl8pU1e5uMdk387dtwxBhdrghQRfke8RflhI'; // Mevcut kullanıcı için JWT token

    adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMWJiZWQ5LTgyNDYtNDMzMy05YWQ4LWFiZGQwNTM0YWRiYyIsInJvbGVJZCI6ImU5ODVkOTk0LTAyYTYtNDIxMy05MmM0LWM3NDRlYWRjYzk1NSIsImlhdCI6MTc1MTI5NTg2NSwiZXhwIjoxNzUxMjk5NDY1fQ.XcMfIG3nSse2mMkhfSQcuzWW7TEPFeMYTSf1xFQhRec'; // Mevcut admin için JWT token
});

afterAll(async () => {
  await sequelize.close();
});

describe('Article Controller', () => {
  describe('POST /api/articles/create', () => {
    it('should create an article', async () => {
      const res = await request(app)
        .post('/api/articles/create')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Article',
          content: 'This is a test article.',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.article).toHaveProperty('id');
      articleId = res.body.article.id;
      slug = res.body.article.slug;
    });

    it('should return validation error for missing fields', async () => {
      const res = await request(app)
        .post('/api/articles/create')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', 'Validation error');
    });
  });


  describe('GET /articles/published', () => {
    it('should list published articles', async () => {
      const res = await request(app)
        .get('/api/articles/published')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /api/articles/my-articles', () => {
    it('should list user articles', async () => {
      const res = await request(app)
        .get('/api/articles/my-articles')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /articles/all', () => {
    it('should list all articles for admin', async () => {
      const res = await request(app)
        .get('/api/articles/all')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('total');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('GET /articles/:slug', () => {
    it('should get an article by slug', async () => {
      const res = await request(app)
        .get(`/api/articles/${slug}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.article).toHaveProperty('slug', slug);
    });

    it('should return 404 if article not found', async () => {
      const res = await request(app)
        .get('/api/articles/non-existent-slug')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Article not found.');
    });
  });
});