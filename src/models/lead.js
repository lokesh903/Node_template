'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  Lead.init({
    sold_address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    agent_rating: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    MLS_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('started', 'not started', 'completed'),
      allowNull: false,
      defaultValue: 'not started',
    },
    agent_name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Lead',
  });
  return Lead;
};
