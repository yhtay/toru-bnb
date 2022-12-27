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
    options.tableName = 'Reviews';
    await queryInterface.bulkInsert(options, [
      {
        spotId: 2,
        userId: 4,
        review: 'Amazing Friendly Service!',
        stars: 5
      },{
        spotId: 3,
        userId: 4,
        review: 'Mansion of the Dreams!',
        stars: 5
      },
      {
        spotId: 3,
        userId: 5,
        review: 'Welcomed and Great Experience',
        stars: 5
      },
      {
        spotId: 1,
        userId: 6,
        review: 'Just what we needed to relax, Thank you',
        stars: 5
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
    options.tableName = 'Reviews';
    const { Op } = require('sequelize')
    await queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [4, 5, 6] }
    }, {})
  }
};
