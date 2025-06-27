'use strict';

const { v4: uuidv4 } = require('uuid'); // UUID oluşturmak için 'uuid' paketini kullanın

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      { id: uuidv4(), name: 'reader' }, // UUID oluştur
      { id: uuidv4(), name: 'author' },
      { id: uuidv4(), name: 'admin' },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
