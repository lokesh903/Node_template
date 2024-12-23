const { user } = require("../controllers");
const { validateUser } = require("../middleware/auth");

// const { ROUTES } = require("../services/constant");

const router = require("express").Router();

router.route('/register').post(validateUser, user.register);
router.route('/send-otp-email').post(user.sendOtp);
router.route('/verify-otp').post(user.verifyOtp);
router.route('/login').post(user.login);
router.route('/forgot-password').post(user.forgotPassword);

// router.route('/verify-user-email').post(user.verifyEmail);


// router.route(ROUTES.GENERATE_DESCRIPTION_AI).post(commonController.generateDescription)
// router.route(ROUTES.FETCH_CATEGORY).get(commonController.fetchCategories)
// router.route(ROUTES.FETCH_TRANDING_SEARCHES).get(commonController.fetchTrendingSearches)
// router.route(ROUTES.FETCH_MCQ).get(commonController.fetchMcqs)
// router.route(ROUTES.GENERATE_DESCRIPTION_AI).post(commonController.generateDescription)
// router.route(ROUTES.GUEST_LOGIN).post(commonController.guestLogin)

module.exports = router;