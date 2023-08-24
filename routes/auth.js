const express = require("express");

const router = express.Router();
const PasswordValidator = require("../middleware/password-validator");
const { signup, login } = require("../controllers/auth");

router.post("/signup", PasswordValidator, signup);
router.post("/login", login);

module.exports = router;
