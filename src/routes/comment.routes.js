const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/authorization.middleware');
const { 
  createComment, 
  deleteComment, 
  updateComment, 
  listCommentsByArticle 
} = require('../controllers/comment.controller');

// Yorum oluşturma
router.post('/add', authenticate, createComment);

// Yorum silme (adminler tüm yorumları silebilir, kullanıcılar sadece kendi yorumlarını silebilir)
router.delete('/delete/:id', authenticate, isAdmin, deleteComment);

// Yorum güncelleme
router.put('/update/:id', authenticate, updateComment);

// Bir makaleye ait yorumları listeleme
router.get('/articles/:articleId/comments', authenticate, listCommentsByArticle);

module.exports = router;