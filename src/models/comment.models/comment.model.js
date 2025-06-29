const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');
const User = require('../user.models/user.model'); // User modelini içe aktarın


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
            model: 'Articles', // Tablo adı
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users', // Tablo adı
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    tableName: 'Comments',
});

Comment.associate = (models) => {
    Comment.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
};

module.exports = Comment;