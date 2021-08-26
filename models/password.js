var passwordValidator = require("password-validator");

// Create a schema
var passwordModel = new passwordValidator();

// Add properties to it
passwordModel
  .is()
  .min(8)
  .has()
  .uppercase()
  .has()
  .digits(1)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123"]);

module.exports = passwordModel;
