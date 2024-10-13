// controllers/contactController.js
const { User } = require("../models");
const { SUCCESS_MESSAGES, ERROR_MESSAGES, STATUS_CODES, CONVERSATION_STATUS } = require("../services/constant");
const logger = require("../services/logger");
const Response = require("../services/responseService");
const ValidationService = require("../services/validationService");

const user = {
  createUser: async (req, res) => {
    try {
      // Validate input data
      const { error, value } = ValidationService.validateUserRegistrationData(req.body);
      if (error) {
        return Response.joiErrorResponseData(res, error);
      }

      const existingUser = await Lead.findOne({
        where: {email:value.email},
      });

      if (existingUser) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.USER.EXIST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const newUser = await User.create({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
      });


      if (!newUser) {
        return Response.errorResponseWithoutData(
          res,
          ERROR_MESSAGES.USER.FAILED,
          STATUS_CODES.BAD_REQUEST
        );
      }

      // Log the creation of the new user
      logger.info("User created:", newUser);

      // Return success response
      return Response.successResponseWithoutData(
        res,
        SUCCESS_MESSAGES.CONTACT_SAVED,
        STATUS_CODES.OK
      );
    } catch (error) {
      // Log and return internal server error
      logger.error("Error during lead creation: %o", error);
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },
}

module.exports = {
  user,
};
