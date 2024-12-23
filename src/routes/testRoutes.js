const { test } = require("../controllers");

const router = require("express").Router();


router.route('/').get(test.testService);



module.exports = router;