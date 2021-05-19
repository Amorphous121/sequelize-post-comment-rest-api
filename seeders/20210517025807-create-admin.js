'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
      let password = await bcrypt.hash('admin', 10);
      await queryInterface.bulkInsert('users', [{
        first_name: 'Prathamesh',
        last_name : 'Patil',
        email : 'admin@gmail.com',
        password : password,
        roleId : 1
      }], {});

  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('users', { email : 'admin@gmail.com '}, {});
  }
};
