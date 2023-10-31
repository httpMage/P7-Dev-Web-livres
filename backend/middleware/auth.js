const jwt = require("jsonwebtoken");
require("dotenv").config();

const { SECRET_KEY } = process.env;
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const { userId } = decodedToken;
    req.auth = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};