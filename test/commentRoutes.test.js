const request = require('supertest');
const app = require('../src/app'); // Express uygulamanızın ana dosyası
const { sequelize } = require('../models'); // Sequelize bağlantısı
const Article = require('../src/models/article.models/article.model');
const User = require('../src/models/user.models/user.model');

let userToken;
let adminToken;
let articleId;

beforeAll(async () => {
  // Veritabanını sıfırla ve senkronize et
  await sequelize.sync({ force: true });

  // Mevcut bir kullanıcıyı kullan
  const user = await User.findOne({ where: { email: 'johndoe@example.com' } });
  if (!user) {
    throw new Error('Test için gerekli kullanıcı bulunamadı.');
  }

  // Mevcut bir admini kullan
  const admin = await User.findOne({ where: { email: 'admin@example.com' } });
  if (!admin) {
    throw new Error('Test için gerekli admin bulunamadı.');
  }

  // Mevcut bir makaleyi kullan
  const article = await Article.findOne({ where: { title: 'Test Article' } });
  if (!article) {
    throw new Error('Test için gerekli makale bulunamadı.');
  }

  articleId = article.id;

  userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQ2MGY0YWViLWRiMzYtNDM2ZS05ODQyLWI3YmRkNDg1ZjU0NyIsInJvbGVJZCI6IjYzYTNkYjMwLWUxMjUtNDEwYi05MTYzLWQxNThiYzNmMGMyYiIsImlhdCI6MTc1MTI5NTg0MSwiZXhwIjoxNzUxMjk5NDQxfQ.qLkvCNDrl8pU1e5uMdk387dtwxBhdrghQRfke8RflhI";
  adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIzMWJiZWQ5LTgyNDYtNDMzMy05YWQ4LWFiZGQwNTM0YWRiYyIsInJvbGVJZCI6ImU5ODVkOTk0LTAyYTYtNDIxMy05MmM0LWM3NDRlYWRjYzk1NSIsImlhdCI6MTc1MTI5NTg2NSwiZXhwIjoxNzUxMjk5NDY1fQ.XcMfIG3nSse2mMkhfSQcuzWW7TEPFeMYTSf1xFQhRec";
});

afterAll(async () => {
  await sequelize.close();
});

describe('Comment Routes', () => {
  describe('POST /api/comments/add', () => {
    it('should create a comment', async () => {
      const res = await request(app)
        .post('/api/comments/add')
        .set('Authorization', `Bearer ${userToken}`)
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
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/comments/update/:id', () => {
    it('should update a comment', async () => {
      const res = await request(app)
        .put(`/api/comments/update/${commentId}`)
        .set('Authorization', `Bearer ${userToken}`)
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
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          content: 'This is an updated test comment.',
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message', 'Comment not found or you are not the owner.');
    });
  });

});