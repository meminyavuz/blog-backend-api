const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const { isAdmin, isAuthor, isAdminOrAuthor } = require('../middlewares/authorization.middleware');
const {
  createArticle,
  updateArticle,
  deleteArticle,
  listAllArticles,
  listUserArticles,
  listPublishedArticles,
  getArticleBySlug
} = require('../controllers/article.controller');
const cacheMiddleware = require('../middlewares/cache.middleware');
const { publishedArticlesLimiter } = require('../middlewares/rateLimit.middleware');


//Readerlar için
router.get('/published', authenticate, publishedArticlesLimiter, cacheMiddleware(600), listPublishedArticles);

// Yazarlar için
router.get('/my-articles', authenticate, isAuthor, cacheMiddleware(600), listUserArticles);

router.post('/create', authenticate, isAuthor, createArticle);
 
// Admin için
router.get('/all', authenticate, isAdmin, cacheMiddleware(600), listAllArticles);


//dinamik route en sona tanımlanmalı
router.get('/:slug', authenticate, getArticleBySlug);

router.put('/:id', authenticate, isAdminOrAuthor, updateArticle);

router.delete('/:id', authenticate, isAdminOrAuthor, deleteArticle);


module.exports = router;