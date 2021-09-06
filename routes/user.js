const express = require("express");
const router = express.Router();

const password = require("../middleware/password");
const userController = require("../controllers/user");

router.post("/signup", password, userController.signup);
router.post("/login", userController.login);

module.exports = router;
