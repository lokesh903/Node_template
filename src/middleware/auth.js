const Response = require("../services/responseService");
const CONSTANTS= require("../services/constant");
const jwt = require("jsonwebtoken");
const logger = require("../services/logger");
const AuthService = require("../services/authService");
const { InvalidTokenError, ExpiredTokenError } = require("../services/errorHandler");

module.exports = {
    validateUser: async function(req, res, next) {
        try {
            let token = req.header("Authorization");
            
            if (!token) {
                return Response.errorResponseWithoutData(
                    res, 
                    "Unauthorized access", 
                    CONSTANTS.STATUS_CODES.UNAUTHORIZED 
                );
            }
            
            const tokenString = token.split("Bearer ")[1];
            
            const decoded = await AuthService.verifyToken(tokenString);
    
            req.id = decoded.id;
            req.role = decoded.role;
            next();
        } catch (error) {

            if (error instanceof InvalidTokenError) {
                return Response.errorResponseWithoutData(
                    res,
                    "Invalid token",
                    CONSTANTS.STATUS_CODES.UNAUTHORIZED 
                );
            } else if (error instanceof ExpiredTokenError) {
                return Response.errorResponseWithoutData(
                    res,
                    "Token has expired, please login again",
                    CONSTANTS.STATUS_CODES.UNAUTHORIZED 
                );
            }
    
            return Response.errorResponseWithoutData(
                res,
                CONSTANTS.INTERNAL_SERVER_ERROR,
                CONSTANTS.STATUS_CODES.INTERNAL_SERVER_ERROR
            );
        }
    },
    validateAdmin: async function(req, res, next) {
        try {
            let tokenString = req.cookies['x-token'];
            console.log("tokenString::", tokenString);
            
            // Check if token is present
            if (!tokenString) {
                return res.render("admin/auth/login.ejs", {
                    error: "Unauthorized access",
                    message:"",
                });
            }
            
            tokenString = tokenString.split("Bearer ")[1];
            
            console.log("i am here 1");
            const decoded = await AuthService.verifyToken(tokenString);
            
            req.id = decoded.id;
            req.email = decoded.email;
            console.log("i am here 2");
            next();
        } catch (error) {
            let errorMessage = "";
    
            if (error instanceof InvalidTokenError) {
                errorMessage = "Invalid token";
            } else if (error instanceof ExpiredTokenError) {
                errorMessage = "Token has expired, please login again";
            } else {
                errorMessage = "An internal server error occurred";
            }
    
            // Render the login page with the error message
            return res.render('admin/auth/login.ejs', {
                message:"",
                error: errorMessage
            });
        }
    }
}
