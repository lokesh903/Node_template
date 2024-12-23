// controllers/contactController.js
const Joi = require("joi");
const { User, UserOtp } = require("../models");
const CONSTANTS = require("../services/constant");
const helper = require("../services/helper");
const logger = require("../services/logger");
const mailer = require("../services/mailer");
const Response = require("../services/responseService");
const ValidationService = require("../services/validationService");
const jwt = require('jsonwebtoken');

const user = {
  register: async (req, res) => {
    try {

      if(req.role != 'admin'){
        return Response.errorResponseWithoutData(
          res,
          CONSTANTS.USER.UNAUTHORIZED,
          CONSTANTS.STATUS_CODES.UNAUTHORIZED
        );
      }
      // Validate input data
      const { error, value } = ValidationService.validateUserRegistrationData(
        req.body
      );
      if (error) {
        return Response.joiErrorResponseData(res, error);
      }

      const existingUser = await User.findOne({
        where: { email: value.email },
      });

      if (existingUser) {
        return Response.errorResponseWithoutData(
          res,
          CONSTANTS.USER.EXIST,
          CONSTANTS.STATUS_CODES.BAD_REQUEST
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
          CONSTANTS.USER.FAILED,
          CONSTANTS.STATUS_CODES.BAD_REQUEST
        );
      }

      // Log the creation of the new user
      logger.info("User created:", newUser);

      // Return success response
      return Response.successResponseWithoutData(
        res,
        CONSTANTS.USER.SAVED,
        CONSTANTS.STATUS_CODES.OK
      );
    } catch (error) {
      // Log and return internal server error
      logger.error("Error during User creation: %o", error);
      return Response.errorResponseWithoutData(
        res,
        CONSTANTS.INTERNAL_SERVER_ERROR,
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },
  login: async (req, res) => {
    try {
      // Validate input data
      const { error, value } = ValidationService.validateUserLoginData(
        req.body
      );
      if (error) {
        return Response.joiErrorResponseData(res, error);
      }

      const { email, password } = value;

      // Find user by email
      const existingUser = await User.findOne({
        where: { email },
        attributes: {
          include: ['password'],
      }
      });
      
      if (!existingUser) {
        return Response.errorResponseWithoutData(
          res,
          CONSTANTS.USER.NOT_FOUND,
          CONSTANTS.STATUS_CODES.UNAUTHORIZED
        );
      }
      if (!existingUser.is_email_verified) {
        return Response.errorResponseWithoutData(
          res,
          "Email not verified",
          CONSTANTS.STATUS_CODES.UNAUTHORIZED
        );
      }

      const isPasswordValid = await existingUser.validatePassword(password,existingUser.dataValues.password);
      if (!isPasswordValid) {
        return Response.errorResponseWithoutData(
          res,
          CONSTANTS.USER.INVALID_PASSWORD,
          CONSTANTS.STATUS_CODES.UNAUTHORIZED
        );
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { id: existingUser.id, role: existingUser.role },
        process.env.JWT_SECRET,
        {
          expiresIn: CONSTANTS.USER.TOKEN_EXPIRE, 
        }
      );

      const refreshToken = jwt.sign(
        { id: existingUser.id },
        process.env.JWT_SECRET,
        {
          expiresIn: CONSTANTS.USER.REFRESH_EXPIRE, 
        }
      );
      console.log("refreshToken::",refreshToken);
      
      existingUser.refresh_token = refreshToken;
      await existingUser.save();

      logger.info("User logged in:", existingUser);

      return Response.successResponseData(
        res,
        CONSTANTS.USER.LOGIN_SUCCESS,
        {user:existingUser,refreshToken,accessToken},
        CONSTANTS.STATUS_CODES.OK
      );
    } catch (error) {
      logger.error("Error during User login: %o", error);
      return Response.errorResponseWithoutData(
        res,
        CONSTANTS.INTERNAL_SERVER_ERROR,
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },

  sendOtp: async (req, res) => {
    try {
      // Validate input data
      const reqObj = {
        email: Joi.string().email().required(),
        moto: Joi.string().required()
      }
      const schema = Joi.object(reqObj)
      const { error } = schema.validate(req.body)
      if (error) {
        return Response.joiErrorResponseData(res, error);
      }

      if(!Object.values(CONSTANTS.OTP_MOTO).includes(req.body.moto)) {
        return Response.errorResponseWithoutData(res,"Moto not found",CONSTANTS.STATUS_CODES.BAD_REQUEST)
      }
      
      const { email } = req.body;

      const isEmailExist = await User.findOne({
				where: {
					email: email,
				},
			})

      if(!isEmailExist) {
        return Response.errorResponseWithoutData(res,"Email not found",CONSTANTS.STATUS_CODES.UNAUTHORIZED)
      }

      // Find user by email

      

      const minutesLater = new Date()
      const otp = process.env.OTP_TESTING == 1 ? 111111 : helper.makeRandomNumber(6)
      const verifyTokenExpire = minutesLater.setMinutes(
        minutesLater.getMinutes() + process.env.OTP_EXPIRE_MINS
      )
      const updatedUser = {
        otp: otp,
        otp_type: CONSTANTS.OTP_TYPE.EMAIL,
        otp_expiry: verifyTokenExpire,
        email: email,
        user_id: isEmailExist.id,
      }

      const otpData = await UserOtp.create(updatedUser)
      if(!otpData) {
        return Response.errorResponseWithoutData(res,"Something went wrong",CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR)
      }

      const locals = {
        username: isEmailExist.name,
        appName: CONSTANTS.APP_NAME,
        otp,
        moto: req.body.moto,
      };

      
      let templatePath = CONSTANTS.EMAIL_TEMPLATE_PATH.ACCOUNT_VERIFICATION
      let subject = CONSTANTS.EMAIL_SUBJECTS.ACCOUNT_VERIFICATION

      if(req.body.moto === CONSTANTS.OTP_MOTO.FORGOT_PASSWORD) {
        templatePath = CONSTANTS.EMAIL_TEMPLATE_PATH.FORGOT_PASSWORD
        subject = CONSTANTS.EMAIL_SUBJECTS.FORGOT_PASSWORD
      }

     


      const mail = await mailer.sendMail(email, subject, templatePath, locals)
      if (!mail) {
        return Response.errorResponseData(res, res.locals.__('Something went wrong'));
      }
      

      return Response.successResponseWithoutData(
        res,
        CONSTANTS.USER.OTP_SENT,
        CONSTANTS.STATUS_CODES.OK
      );
    } catch (error) {
      logger.error("Error during OTP send: %o", error);
      return Response.errorResponseWithoutData(
        res,
        CONSTANTS.INTERNAL_SERVER_ERROR,
        CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },

  verifyOtp: async (req, res) => {

    const { error, value } = ValidationService.validateOtp(req.body);
    if (error) return Response.joiErrorResponseData(res, error);

    try {

      const user = await User.findOne({ where: { email: value.email } });
      if (!user) return Response.errorResponseWithoutData(res, CONSTANTS.ERROR_MESSAGES.NOT_FOUND, CONSTANTS.STATUS_CODES.NOT_FOUND );

      const otpRecord = await UserOtp.findOne({ where: { email: value.email, otp_type: CONSTANTS.OTP_TYPE.EMAIL }, order: [["id", "DESC"]] });
      if (!otpRecord || otpRecord.otp !== Number(value.otp)) {
        return Response.errorResponseWithoutData(res, 'Invalid OTP');
      }

      if (otpRecord.otp_expiry < Date.now()) {
        return Response.errorResponseWithoutData(res, 'OTP expired');
      }

      await user.update({ is_email_verified: true });

      return Response.successResponseWithoutData(res, 'OTP verified');
    } catch (error) {
      console.error("otp verification error: ", error);
      return Response.errorResponseWithoutData(res, CONSTANTS.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  },
  forgotPassword: async (req, res) => {

    const { error, value } = ValidationService.validateForgotPassword(req.body);
    if (error) return Response.joiErrorResponseData(res, error);

    try {
      const user = await User.findOne({ where: { email: value.email } });
      if (!user) return Response.errorResponseWithoutData(res, 'Email not found', CONSTANTS.STATUS_CODES.NOT_FOUND);

      const otpRecord = await UserOtp.findOne({ where: { email: value.email, otp_type: CONSTANTS.OTP_TYPE.EMAIL }, order: [["id", "DESC"]] });
      if (!otpRecord || otpRecord.otp !== Number(value.otp)) {
        return Response.errorResponseWithoutData(res, 'Invalid OTP');
      }

      if (otpRecord.otp_expiry < Date.now()) {
        return Response.errorResponseWithoutData(res, 'OTP expired');
      }

      user.password = value.new_password
      await user.save();
      return Response.successResponseWithoutData(res, 'Password reset successfully');

    } catch (error) {
      console.error("reset password error: ", error);
      return Response.errorResponseWithoutData(res, CONSTANTS.ERROR_MESSAGES.INTERNAL_SERVER_ERROR, CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR);
    }
  },

};




module.exports = {
  user,
};
