var passwordValidator = require("password-validator");

var passwordModel = new passwordValidator();

passwordModel
  .is().min(4)
  .has().uppercase()
  .has().digits(1)
  .has().not().spaces()
  .is().not().oneOf(["Password", "Passw0rd", "Password123"]);

module.exports = passwordModel;
