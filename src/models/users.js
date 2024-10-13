'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');  // For hashing passwords

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if needed, like belongsTo, hasMany, etc.
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    access_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_plan: {
      type: DataTypes.ENUM('free', 'basic', 'pro'),
      defaultValue: 'free',
    },
    api_usage_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  }, {
    sequelize,
    modelName: 'User',  
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);  
      },
    },
    timestamps: true,  
    tableName: 'users', 
  });

  return User;
};
