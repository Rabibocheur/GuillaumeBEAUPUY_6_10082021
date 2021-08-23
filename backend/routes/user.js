const express = require("express");
const router = express.Router();

const verifPassword = require("../middleware/verif-password");
const userController = require("../controllers/user");

router.post("/signup", verifPassword, userController.signup);
router.post("/login", userController.login);

module.exports = router;
