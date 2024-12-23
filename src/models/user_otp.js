'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserOtp extends Model {
    static associate(models) {
      // Define associations here if needed, like belongsTo, hasMany, etc.
      // For example, if you have a User model, you might want to associate it like this:
      // this.belongsTo(models.User, { foreignKey: 'user_id' });
    }

    // Method to check if OTP is expired
    isExpired() {
      return new Date() > this.otp_expiry;
    }
  }

  UserOtp.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    otp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    otp_expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    otp_type: {
      type: DataTypes.INTEGER,
      comment: '1:mobile, 2:email, 3:forgot-password',
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  }, {
    sequelize,
    modelName: 'UserOtp',
    timestamps: true,
    tableName: 'user_otp',
    underscored: true,
  });

  return UserOtp;
};