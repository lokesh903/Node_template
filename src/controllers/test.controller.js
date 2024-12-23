// controllers/contactController.js
const { SUCCESS_MESSAGES, ERROR_MESSAGES, STATUS_CODES } = require("../services/constant");
const logger = require("../services/logger");
const Response = require("../services/responseService");

const test = {
  testService: async (req, res) => {
    try { 
      // Validate input data
      console.log("test api called ");
      
      return res.send(SUCCESS_MESSAGES.TEST_CALLED)
    } catch (error) {
      // Log and return internal server error
      logger.error("Error in test caling", error);
      return Response.errorResponseWithoutData(
        res,
        ERROR_MESSAGES.INTERNAL.SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  },
  sendOtp: async (req, res) => {
		const reqParam = req.body
		const reqObj = {
			email: Joi.string().email().required()
		}
		const schema = Joi.object(reqObj)
		const { error } = await schema.validate(reqParam)
		if (error) {
			return Response.validationErrorResponseData(
				res,
				res.__(Helper.validationMessageKey('Email verification validation', error))
			)
		} else {
			const isEmailExist = await user.findOne({
				where: {
					email: reqParam.email,
					status: {
						[Op.not]: DELETE,
					},
				},
			}).then((userMobileExistData) => userMobileExistData)
			if (isEmailExist) {
				const minutesLater = new Date()
				const otp = process.env.OTP_TESTING === 1 ? 111111 : Helper.makeRandomNumber(6)
				const verifyTokenExpire = minutesLater.setMinutes(
					minutesLater.getMinutes() + 1440
				)
				const updatedUser = {
					otp: otp,
					otp_type: OTP_TYPE.EMAIL,
					otp_expiry: verifyTokenExpire,
					email: reqParam.email,
					user_id: isEmailExist.id,
				}
				await userOtp.create(updatedUser).then(async (otpData) => {
					if (!otpData) {
						Response.errorResponseData(
							res,
							res.locals.__('Something went wrong'),
						)
					} else {
						const UserData = await user.findByPk(isEmailExist.id)
						const locals = {
							username: UserData.name,
							appName: Helper.AppName,
							otp
						};
						try {
							// const mail = await Mailer.sendMail(reqParam.email, 'EMAIL VERIFICATION!', Helper.sendVerificationCode, locals);
							const mail = await Mailer.sendMail(reqParam.email, 'EMAIL VERIFICATION!', Helper.sendVerificationCode, locals)
							if (mail) {
								return Response.successResponseWithoutData(res, res.locals.__('Otp send successfully'), 200)
							} else {
								Response.errorResponseData(res, res.locals.__('Something went wrong'));
							}
						} catch (e) {
							Response.errorResponseData(res, e.message)
						}
					}
				},
					(e) => {
						console.log(e);
						Response.errorResponseData(
							res,
							res.__('Something went wrong'),
							INTERNAL_SERVER
						)
					})
			} else {
				return Response.errorResponseData(
					res,
					res.locals.__('Email does not exist'),
					NO_DATA_FOUND
				)
			}
		}
	},

};

module.exports = {
  test
};
