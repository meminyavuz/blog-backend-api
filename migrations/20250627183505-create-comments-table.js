'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      articleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Articles', // Article tablosuna referans
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Makale silindiğinde yorumlar da silinir
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // User tablosuna referans
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Kullanıcı silindiğinde yorumlar da silinir
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
