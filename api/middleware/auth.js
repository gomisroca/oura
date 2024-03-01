const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).send("A token is required for authentication");
  } else {
    try {
      const decodedUserData = jwt.verify(token, process.env.TOKEN_KEY);
      req.user = decodedUserData;
      return next();
    } catch (err) {
      return res.status(401).send("Invalid Token");
    }
  }
};

module.exports = verifyToken;