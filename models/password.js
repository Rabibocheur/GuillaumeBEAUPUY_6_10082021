var passwordValidator = require("password-validator");

var passwordModel = new passwordValidator();

passwordModel
  .is().min(8)
  .has().uppercase()
  .has().digits(1)
  .has().not().spaces()
  .is().not().oneOf(["Passw0rd", "Password123"]);

module.exports = passwordModel;
