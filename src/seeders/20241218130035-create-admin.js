'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('All1doiswin!', saltRounds);

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin',
        email: 'dustin@realtyiq.io',
        password: hashedPassword,
        role: 'admin',
        mock_call_usage_limit: 1000, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { email: 'dustin@realtyiq.io' });
  },
};
