const Joi = require("joi");

// Common field schemas
const emailSchema = Joi.string().email().required().label("Email");

// Validation service module
const ValidationService = {
  validateOtp: (data) =>
    Joi.object({
      email: emailSchema,
      otp: Joi.number().integer().required().label("OTP"),
    }).validate(data),

  validateUserRegistrationData: (data) => {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
      role: Joi.string().optional().allow(null),
    });

    return schema.validate(data, { abortEarly: false });
  },
  validateUserLoginData: (data) => {
    const schema = Joi.object({
      email: Joi.string().email(),
      password: Joi.string(),
    });

    return schema.validate(data, { abortEarly: false });
  },
  validateForgotPassword: (data) => {
    const schema = Joi.object({
      email: Joi.string().email(),
      otp: Joi.string(),
      new_password: Joi.string(),
    });
    return schema.validate(data, { abortEarly: false });
  },
};

module.exports = ValidationService;
