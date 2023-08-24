const PasswordValidator = require("password-validator");

const passwordSchema = new PasswordValidator();
passwordSchema
  .is()
  .min(8)
  .has()
  .uppercase(1)
  .has()
  .lowercase(1)
  .has()
  .digits(1)
  .has()
  .symbols(1);

const validatePassword = (req, res, next) => {
  const { password } = req.body;

  if (!passwordSchema.validate(password)) {
    return res.status(400).json(new Error());
  }

  next();
};

module.exports = validatePassword;
