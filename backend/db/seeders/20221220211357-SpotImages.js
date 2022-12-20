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
    options.tableName = 'SpotImages';
    await queryInterface.bulkInsert(options,[
      {
        spotId: 1,
        url: 'www.kingdomOfLeo.com',
        preview: true,
      },
      {
        spotId: 2,
        url: 'www.welcom2hotelRonaldo.com',
        preview: true,
      },
      {
        spotId: 2,
        url: 'www.smoothmansion.com',
        preview: true,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'SpotImages';

  }
};
