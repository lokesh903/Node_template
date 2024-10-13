const Response = require("../services/responseService");
const { STATUS_CODES } = require("../services/constant");
const jwt = require("jsonwebtoken");
const logger = require("../services/logger");
const AuthService = require("../services/authService");


module.exports = {
    validateVendor: async function(req, res, next) {
        try {
            let token = req.header("Authorization")
            if(!token){
                return Response.errorResponseWithoutData(res, "Unauthorized access", STATUS_CODES.FORBIDDEN)
            }
            tokenString = token.split("Bearer ")[1];
            const decoded = await AuthService.verifyToken(tokenString)
            if (decoded.role !== 'vendor') {
                return Response.errorResponseWithoutData(res, "Unauthorized access: Only vendors allowed", STATUS_CODES.FORBIDDEN);
              }
            req._id = decoded.id;
            req.email = decoded.email;
            next(); 
        } catch (error) {
            logger.error("Middleware Error:", error);
        }
    },
    validateUser: async function(req, res, next) {
        try {
            let token = req.header("Authorization")
            if(!token){
                return Response.errorResponseWithoutData(res, "Unauthorized access", STATUS_CODES.FORBIDDEN)
            }
            tokenString = token.split("Bearer ")[1];
            const decoded = await AuthService.verifyToken(tokenString);
            req._id = decoded.id;
            req.email = decoded.email;
            next(); 
        } catch (error) {
            logger.error("Middleware Error:", error);
        }
    }
}
