'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    options.tableName = 'Bookings';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 4,
        startDate: '2023-01-15',
        endDate: '2023-02-16'
      },
      {
        spotId: 3,
        userId: 5,
        startDate: '2023-02-15',
        endDate: '2023-03-10'
      },
      {
        spotId: 1,
        userId: 6,
        startDate: '2023-03-09',
        endDate: '2023-03-30'
      }
    ], {})
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
