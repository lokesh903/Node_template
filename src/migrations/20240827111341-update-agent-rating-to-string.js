'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Leads', 'agent_rating', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Leads', 'agent_rating', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });
  }
};
