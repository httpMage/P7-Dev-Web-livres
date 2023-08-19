const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "dontTellAnyone");
    const { userId } = decodedToken;
    req.auth = { userId };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
