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
   options.tableName = 'ReviewImages';
   await queryInterface.bulkInsert(options, [
    {
      reviewId: 1,
      url: 'www.hotelronaldo.com',
    },
    {
      reviewId: 1,
      url: 'www.hotelronaldo2.com',
    },
    {
      reviewId: 2,
      url: 'www.mansionhenry.com',
    },
    {
      reviewId: 3,
      url: 'www.bestresortever.com',
    },
   ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'ReviewImages';
    const { Op } = require('sequelize')
    await queryInterface.bulkDelete(options, {
      reviewId: { [Op.in]: [1, 2, 3]}
    })
  }
};
