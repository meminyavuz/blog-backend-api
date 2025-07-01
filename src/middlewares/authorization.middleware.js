const Article = require('../models/article.models/article.model.js'); // Article modelini içe aktar

const roleMapping = {
  admin: process.env.ADMIN_ROLE_ID, // Admin rolüne karşılık gelen ID
  author: process.env.AUTHOR_ROLE_ID, // Author rolüne karşılık gelen ID
  reader: process.env.READER_ROLE_ID // Reader rolüne karşılık gelen ID
};

const isAdmin = (req, res, next) => {
  if (req.user.roleId !== roleMapping.admin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

const isAuthor = (req, res, next) => {
  if (req.user.roleId !== roleMapping.author) {
    return res.status(403).json({ message: 'Access denied. Authors only.' });
  }
  next();
};

const isAdminOrAuthor = async (req, res, next) => {
  try {
    // Eğer kullanıcı admin ise, işlemi devam ettir
    if (req.user.roleId === roleMapping.admin) {
      return next();
    }

    // Eğer kullanıcı admin değilse, yazar kontrolü yap
    const article = await Article.findByPk(req.params.id); // Makale ID'sini kontrol et
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (article.authorId !== req.user.id) {
      return res.status(403).json({ message: 'Access denied. You are not the author of this article.' });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while checking permissions.' });
  }
};

module.exports = {
  isAdmin,
  isAuthor,
  isAdminOrAuthor
};