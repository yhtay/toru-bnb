'use strict';

const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
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
   options.tableName = 'Spots';
   await queryInterface.bulkInsert(options, [
    {
      ownerId: 4,
      address: '10 Leo Street',
      city: 'Rosario',
      state: 'Sante Fe',
      country: 'Argentina',
      lat: 10.10,
      lng: 10.10,
      name: 'M10 Resort',
      description: 'Home of the best football player',
      price: 1010.10,
    },
    {
      ownerId: 5,
      address: '7 Ronaldo Street',
      city: 'Funchal',
      state: 'Madeira',
      country: 'Portugal',
      lat: 7.07,
      lng: 7.07,
      name: 'CR7 Hotel',
      description: 'Home of the 2nd best football player',
      price: 777.77,
    },
    {
      ownerId: 6,
      address: '14 Henry Street',
      city: 'Paris',
      state: 'France',
      country: 'France',
      lat: 14.14,
      lng: 14.14,
      name: 'H14 Mansion',
      description: 'Home of the legendary football player',
      price: 1400.14,
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
    options.tableName = 'Spots';
    const { Op } = require('sequelize')
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['M10 Resort', 'CR7 Hotel', 'H14 Mansion'] }
    }, {})
  }
};
