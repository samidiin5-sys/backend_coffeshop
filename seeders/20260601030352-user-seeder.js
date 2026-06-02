'use strict';

const passwordHash = require('password-hash');

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Users', [

      {
        name: 'Administrator',
        email: 'admin@gmail.com',
        password: passwordHash.generate('admin123'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      {
        name: 'Kasir',
        email: 'kasir@gmail.com',
        password: passwordHash.generate('kasir123'),
        role: 'kasir',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};