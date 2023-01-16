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
      description: "GOAT's Resort",
      price: 1010.11,
    },
    {
      ownerId: 4,
      address: '30 Andres Ave',
      city: 'Rosario',
      state: 'Sante Fe',
      country: 'Argentina',
      lat: 30.30,
      lng: 30.30,
      name: 'M10 Mansion',
      description: "GOAT's Mansion",
      price: 999.99,
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
      description: 'Luxury Living',
      price: 777.77,
    },
    {
      ownerId: 5,
      address: '7 Siuu Road',
      city: 'Funchal',
      state: 'Madrid',
      country: 'Spain',
      lat: 70.77,
      lng: 70.77,
      name: 'CR7 Penthouse',
      description: 'Penthouse',
      price: 777.33,
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
      description: 'Smooth Mansion',
      price: 140.14,
    },
    {
      ownerId: 6,
      address: '12 W. Monaco Street',
      city: 'Monaco',
      state: 'France',
      country: 'France',
      lat: 12.14,
      lng: 12.14,
      name: 'H14 Villa',
      description: 'Fresh Villa',
      price: 120.12,
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
      name: { [Op.in]: ['M10 Resort', 'M10 Mansion', 'CR7 Hotel', 'CR7 Penthouse', 'H14 Mansion', 'H14 Villa'] }
    }, {})
  }
};
