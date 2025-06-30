const request = require('supertest');
const app = require('../src/app'); // Express uygulamanızın ana dosyası
const { sequelize } = require('../src/models/index'); // Sequelize bağlantısı

let token; // Kullanıcı oturum token'ı
let adminToken; // Admin oturum token'ı
let articleId; // Test için oluşturulan makale ID'si
let slug; // Test için oluşturulan makale slug'ı

beforeAll(async () => {
    // Veritabanını sıfırla ve senkronize et
    await sequelize.sync({ force: false });

    // Kullanıcı için giriş yap ve token al
    const userLoginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'testuser@example.com',
            password: 'password123',
        });

    token = userLoginResponse.body.token; // Kullanıcı token'ini kaydet

    // Admin için giriş yap ve token al
    const adminLoginResponse = await request(app)
        .post('/api/users/login')
        .send({
            email: 'testadmin@example.com',
            password: 'password123',
        });

    adminToken = adminLoginResponse.body.token; // Admin token'ini kaydet
    console.log('Admin token:', adminToken);
    console.log('User token:', token);
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