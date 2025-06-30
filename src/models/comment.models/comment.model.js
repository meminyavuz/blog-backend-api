const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Role = require('../user.models/role.model');
const User = require('../user.models/user.model'); // User modelini içe aktar
const Article = require('../article.models/article.model'); // Article modelini içe aktar
const bcrypt = require('bcrypt'); // Şifre hashleme için bcrypt modülü

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    articleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Article, // Article modeline referans
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Makale silindiğinde yorumlar da silinir
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User, // User modeline referans
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Kullanıcı silindiğinde yorumlar da silinir
    },
},{
    tableName: 'Comments', // Veritabanında kullanılacak tablo adı
}
);


// models/comment.js
Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'article'
    });
  
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
};
  
module.exports = Comment;