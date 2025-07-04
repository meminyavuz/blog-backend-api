const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database.js');
const slugify = require('slugify');
const Status = require('./status.model.js');
const User = require('../user.models/user.model.js');

// Article modeli tanımı
const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  statusId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Status, 
      key: 'id',
    },
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'Articles', // Veritabanında kullanılacak tablo adı
  timestamps: true,
  hooks: {
    // Makale oluşturulmadan önce slug oluştur
    beforeCreate: async (article) => {
      article.slug = await generateUniqueSlug(article.title);
    },
    // Makale güncellenmeden önce slug'ı güncelle
    beforeUpdate: async (article) => {
      if (article.changed('title')) {
        article.slug = await generateUniqueSlug(article.title);
      }
    },
  },
});

// İlişkiler
Article.associate = (models) => {
  Article.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' }); // Makale -> Kullanıcı
  Article.belongsTo(models.Status, { foreignKey: 'statusId', as: 'status' }); // Makale -> Durum
  Article.hasMany(models.Comment, { foreignKey: 'articleId', as: 'comments' }); // Makale -> Yorumlar
};

// Benzersiz bir slug oluşturma fonksiyonu
const generateUniqueSlug = async (title) => {
  let slug = slugify(title, { lower: true, strict: true });
  let uniqueSlug = slug;
  let counter = 1;

  // Benzersiz bir slug bulunana kadar döngü
  while (await Article.findOne({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

module.exports = Article;