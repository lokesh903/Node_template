const path = require('path');

module.exports = {

    AppName: 'Home Service',

    BASE_PATHS: {
        USER: '/call-training-backend-api/user',
        TEST: '/call-training-backend-api/test'
    },
    OTP_TYPE: {
        MOBILE: 1,
        EMAIL: 2,
    },
    APP_NAME: 'Reintel Call Training App',
    EMAIL_TEMPLATES: {
        FORGOT_PASSWORD: "forgotPassword",
        VERIFY_EMAIL: "verifyEmail",
    },

    URI_PREFIX : {
        development: "",
        test: "/",
        production: "/"
    },
    // Status Codes 
    STATUS_CODES: {
        OK: 200,
        BAD_REQUEST: 400,
        UNAUTHORIZED: 401,
        FORBIDDEN: 403,
        NOT_FOUND: 404,
        INTERNAL_SERVER_ERROR: 500,
    },

    // Mail Subjects (PascalCase for proper nouns)
    EMAIL_SUBJECTS: {
        FORGOT_PASSWORD: 'Forget Password!',
        ACCOUNT_VERIFICATION: 'Email Verification!',
    },

    CONVERSATION_STATUS: {
        STARTED: "started",
        NOT_STARTED: "not started",
        COMPLETED: "completed"
    },


    //  Email Templates (lowercase for consistency)
    EMAIL_TEMPLATE_PATH: {
      FORGOT_PASSWORD: path.join(path.resolve(__dirname, '..') + '/views/emails/forgot-password/html.ejs' ),
      ACCOUNT_VERIFICATION: path.join(path.resolve(__dirname, '..') + '/views/emails/user-verification/html.ejs' ),
      SEND_OTP: path.join(path.resolve(__dirname, '..') + '/views/emails/send-otp/html.ejs' ),
    },

    OTP_MOTO :{
        FORGOT_PASSWORD: "forgot-password",
        VERIFY_EMAIL: "verify-email",
    },

    EMAIL_SUBJECTS: {
        FORGOT_PASSWORD: "Forgot Password",
        ACCOUNT_VERIFICATION: "Account Verification",
        SEND_OTP: "Send OTP",
    },

    LEAD: {
        EXIST: "Contact already exists",
        FAILED: "Contact not saved, please try after some time",
    },
    
    USER: {
        EXIST:  "User already exists",
        FAILED: "User not saved, please try after some time",
        SAVED:  "User registered successfully !",
        NOT_FOUND: "User not found",
        INVALID_PASSWORD: "Invalid Password",
        LOGIN_SUCCESS: "Logged in successfully",
        OTP_SENT: "OTP sent successfully",
        TOKEN_EXPIRE: "7d",
        REFRESH_EXPIRE: "7d",
    },

    SUCCESS_MESSAGES: {
        CONTACT_SAVED: "New contact saved !",
        TEST_CALLED: "Server is running",
    },

    ERROR_MESSAGES : {
        INTERNAL_SERVER_ERROR : "Some thing went wrong, Please try after some time.",
        NOT_FOUND: "Not found",
    }
}
