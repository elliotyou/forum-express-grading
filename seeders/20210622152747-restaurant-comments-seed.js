'use strict';
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Comments',
      Array.from({ length: 100 }).map((d, i) => ({
        text: faker.lorem.text().slice(0, 20),
        UserId: Math.floor(Math.random() * 4) + 1,
        RestaurantId: Math.floor(Math.random() * 30) + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Comments', null, {})
  }
};
