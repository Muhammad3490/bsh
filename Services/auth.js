const jwt = require("jsonwebtoken");
const secret = "@codeComet67123";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    name: user.name,
    username:user.username,
    bio:user.bio,
    profileImgUrl: user.profileImgUrl,
    role: user.role,
    localImg:user.localImg
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