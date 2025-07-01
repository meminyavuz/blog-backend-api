const Article = require('../models/article.models/article.model.js');
const Status = require('../models/article.models/status.model.js');
const createArticleDTO = require('../dtos/article.dtos/createArticle.dto.js');
const updateArticleDTO = require('../dtos/article.dtos/updateArticle.dto.js');
const listArticlesDTO = require('../dtos/article.dtos/listArticles.dto.js');
const { Op } = require('sequelize');

// Makale oluşturma
const createArticle = async (req, res) => {
  try {
    // DTO doğrulaması
    const { error, value } = createArticleDTO.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details });
    }

    const { title, content, statusId } = value;

    // Eğer statusId gönderilmemişse, varsayılan olarak "published" durumunu al
    const defaultStatus = await Status.findOne({ where: { name: 'published' } });
    if (!defaultStatus && !statusId) {
      return res.status(400).json({ message: 'Default status not found and no statusId provided.' });
    }

    const finalStatusId = statusId || defaultStatus.dataValues.id;

    const article = await Article.create({
      title,
      content,
      statusId: finalStatusId,
      authorId: req.user.id, // Kullanıcı ID'si
    });

    res.status(201).json({ message: 'Article created successfully!', article });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while creating the article.', error: err.message });
  }
};

// Makale düzenleme
const updateArticle = async (req, res) => {
  try {
    console.log(req.user.id);
    console.log(req.params.id);

    // DTO doğrulaması
    const { error, value } = updateArticleDTO.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details });
    }

    const { id } = req.params;
    const { title, content, status } = value;

    const article = await Article.findOne({ where: { id, authorId: req.user.id } });
    if (!article) {
      return res.status(404).json({ message: 'Article not found or you are not the author.' });
    }

    article.title = title || article.title;
    article.content = content || article.content;
    article.statusId = status || article.statusId;

    await article.save();

    res.status(200).json({ message: 'Article updated successfully!', article });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the article.', error: err.message });
  }
};

// Makale silme
const deleteArticle = async (req, res) => {
  try {

    const { id } = req.params;

    const article = await Article.findOne({ where: { id, authorId: req.user.id } });
    if (!article) {
      return res.status(404).json({ message: 'Article not found or you are not the author.' });
    }

    await article.destroy();

    res.status(200).json({ message: 'Article deleted successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the article.', error: err.message });
  }
};

// Slug ile makale getirme
const getArticleBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const article = await Article.findOne({ where: { slug } });
    if (!article) {
      return res.status(404).json({ message: 'Article not found.' });
    }

    res.status(200).json({ article });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching the article.', error: err.message });
  }
};

// Tüm makaleleri listeleme (Admin için)
const listAllArticles = async (req, res) => {
  try {
    console.log('Query Params:', req.query); // Gelen sorgu parametrelerini logla
    console.log('User:', req.user); // Kullanıcı bilgilerini logla

    // DTO doğrulaması
    const { error, value } = listArticlesDTO.validate(req.query);

    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details });
    }

    const { page = 1, limit = 10, authorId, title, status, order = 'desc' } = value;

    const where = {};
    if (authorId) where.authorId = authorId; // Yazara göre filtreleme
    if (title) where.title = { [Op.like]: `%${title}%` }; // Başlıkta arama
    if (status) where.statusId = status; // Duruma göre filtreleme

    const articles = await Article.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', order.toLowerCase() === 'asc' ? 'ASC' : 'DESC']], // Tarihe göre sıralama
    });

    res.status(200).json({
      total: articles.count,
      pages: Math.ceil(articles.count / limit),
      data: articles.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching all articles.', error: err.message });
  }
};

// Kullanıcının kendi makalelerini listeleme
const listUserArticles = async (req, res) => {
  try {
    // DTO doğrulaması
    const { error, value } = listArticlesDTO.validate(req.query);

    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details });
    }

    const { page = 1, limit = 10, title, status, order = 'desc', authorId } = value;

    const where = { authorId: req.user.id }; // Sadece giriş yapan yazarın makaleleri
    if (authorId) where.authorId = authorId; // Belirli bir yazarın makaleleri
    if (title) where.title = { [Op.like]: `%${title}%` }; // Başlıkta arama
    if (status) where.statusId = status; // Duruma göre filtreleme

    const articles = await Article.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', order.toLowerCase() === 'asc' ? 'ASC' : 'DESC']], // Tarihe göre sıralama
    });

    res.status(200).json({
      total: articles.count,
      pages: Math.ceil(articles.count / limit),
      data: articles.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching your articles.', error: err.message });
  }
};

const listPublishedArticles = async (req, res) => {
  try {
    const { error, value } = listArticlesDTO.validate(req.query);
    if (error) {
      return res.status(400).json({ message: 'Validation error', error: error.details });
    }

    const { page = 1, limit = 10, title, order = 'desc', authorId } = value;

    //Veritabanından sadece published olan makaleleri al
    const publishedStatus = await Status.findOne({ where: { name: 'published' } });

    if (!publishedStatus) {
      return res.status(400).json({ message: 'Published status not found in the database.' });
    }
    
    const where = { statusId: publishedStatus.id }; // Sadece "published" durumundaki makaleler
    if (authorId) where.authorId = authorId
    if (title) where.title = { [Op.like]: `%${title}%` }; // Başlıkta arama

    const articles = await Article.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', order.toLowerCase() === 'asc' ? 'ASC' : 'DESC']], // Tarihe göre sıralama
    });

    res.status(200).json({
      total: articles.count,
      pages: Math.ceil(articles.count / limit),
      data: articles.rows,
    });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching published articles.', error: err.message });
  }
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  listAllArticles,
  listUserArticles,
  listPublishedArticles,
  getArticleBySlug
};