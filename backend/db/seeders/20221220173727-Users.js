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
    options.tableName = 'Users';
    await queryInterface.bulkInsert(options, [
      {
        email: 'messi10@barca.com',
        username: 'messi10',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Lionel',
        lastName: 'Messi'
      },
      {
        email: 'ronaldo7@realmadrid.com',
        username: 'ronaldo7',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'Cristiano',
        lastName: 'Ronaldo'
      },
      {
        email: 'henry14@arsenal.com',
        username: 'henry14',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'Thierry',
        lastName: 'Henry'
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
    options.tableName = 'Users';
    const { Op } = require('sequelize')
    await queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['messi10', 'ronaldo7', 'henry14'] }
    }, {})
  }
};
