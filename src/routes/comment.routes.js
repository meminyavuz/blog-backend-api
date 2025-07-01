const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { 
  createComment, 
  deleteComment, 
  updateComment, 
  listCommentsByArticle 
} = require('../controllers/comment.controller');


// Yorum oluşturma
router.post('/add', authenticate, createComment);

// Yorum güncelleme (adminler tüm yorumları silebilir, kullanıcılar sadece kendi yorumlarını silebilir)
router.put('/update/:id', authenticate, updateComment);

// Yorum silme (adminler tüm yorumları silebilir, kullanıcılar sadece kendi yorumlarını silebilir)
router.delete('/delete/:id', authenticate, deleteComment);

// Bir makaleye ait yorumları listeleme
router.get('/articles/:articleId/comments', authenticate, listCommentsByArticle);

module.exports = router;