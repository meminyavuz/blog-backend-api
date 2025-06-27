const Article = require('../models/article.model.js');
const Status = require('../models/status.model.js');
const CreateArticleDTO = require('../dtos/article.dtos/createArticle.dto.js');
const UpdateArticleDTO = require('../dtos/article.dtos/updateArticle.dto.js');

// Makale oluşturma
const createArticle = async (req, res) => {
  try {
    // DTO doğrulaması
    const { error, value } = CreateArticleDTO.validate(req.body);
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
    // DTO doğrulaması
    const { error, value } = UpdateArticleDTO.validate(req.body);
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
    article.status = status || article.status;

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

// Tüm makaleleri listeleme (Admin için)
const listAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching articles.', error: err.message });
  }
};

// Kullanıcının kendi makalelerini listeleme
const listUserArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({ where: { authorId: req.user.id } });
    res.status(200).json({ articles });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while fetching your articles.', error: err.message });
  }
};

module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  listAllArticles,
  listUserArticles,
};