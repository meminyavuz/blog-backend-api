const request = require('supertest');
const app = require('../src/app'); // Express uygulamanızın ana dosyası
const { sequelize } = require('../src/models/index'); // Sequelize bağlantısı
const Article = require('../src/models/article.models/article.model');
const User = require('../src/models/user.models/user.model');

let userToken;
let adminToken;
let articleId;

beforeAll(async () => {
  // Veritabanını sıfırla ve senkronize et
  await sequelize.sync({ force: false });

  // Mevcut bir makaleyi kullan
  const article = await Article.findOne({ where: { title: 'Test Article' } });
  if (!article) {
    throw new Error('Test için gerekli makale bulunamadı.');
  }

  articleId = article.id;

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
});

afterAll(async () => {
  await sequelize.close();
});

describe('Comment Routes', () => {
  describe('POST /api/comments/add', () => {
    it('should create a comment', async () => {
      const res = await request(app)
        .post('/api/comments/add')
        .set('Authorization', `Bearer ${token}`)
        .send({
          articleId,
          content: 'This is a test comment.',
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Comment created successfully!');
      expect(res.body.comment).toHaveProperty('id');
      commentId = res.body.comment.id; // Yorum ID'sini kaydet
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/comments/add')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/comments/update/:id', () => {
    it('should update a comment', async () => {
      const res = await request(app)
        .put(`/api/comments/update/${commentId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is an updated test comment.',
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Comment updated successfully!');
      expect(res.body.comment).toHaveProperty('content', 'This is an updated test comment.');
    });

    it('should return 404 if comment is not found', async () => {
      const res = await request(app)
        .put('/api/comments/update/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          content: 'This is an updated test comment.',
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Comment not found or you are not the owner.');
    });
  });

});