const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin, isAuthor } = require('../middlewares/authorization.middleware');
const {
  createArticle,
  updateArticle,
  deleteArticle,
  listAllArticles,
  listUserArticles,
} = require('../controllers/article.controller');


// Yazarlar için
router.post('/create', authenticate, isAuthor, createArticle);
router.put('/:xm', authenticate, isAuthor, updateArticle);
router.delete('/:id', authenticate, isAuthor, deleteArticle);
router.get('/my-articles', authenticate, isAuthor, listUserArticles);
 
// Admin için
router.get('/all', authenticate, isAdmin, listAllArticles);

module.exports = router;