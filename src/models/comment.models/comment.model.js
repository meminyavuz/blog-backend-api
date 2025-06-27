const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const Article = require('../article.models/article.model'); // Article modelini içe aktar
const User = require('../user.models/user.model'); // User modelini içe aktar

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

module.exports = Comment;