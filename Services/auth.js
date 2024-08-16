const jwt = require("jsonwebtoken");
const secret = "@codeComet67123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
    profileImgUrl: user.profileImgUrl,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = {
  validateToken,
  createTokenForUser,
};