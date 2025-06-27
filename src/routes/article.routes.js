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
  listPublishedArticles
} = require('../controllers/article.controller');

//Readerlar için
router.get('/published', authenticate, listPublishedArticles);

// Yazarlar için
router.get('/my-articles', authenticate, isAuthor, listUserArticles);
router.post('/create', authenticate, isAuthor, createArticle);
router.put('/:xm', authenticate, isAuthor, updateArticle);
router.delete('/:id', authenticate, isAuthor, deleteArticle);
 
// Admin için
router.get('/all', authenticate, isAdmin, listAllArticles);
router.put('/admin/:id', authenticate, isAdmin, updateArticle);

module.exports = router;