const { validateToken } = require("../Services/auth");

function checkAuth(cookieName) {
  return async (req, res, next) => {

    const userToken =
      req.cookies[cookieName] || req.headers.authorization?.split(" ")[1];
      

    if (!userToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const payload = await validateToken(userToken);
      req.user = payload;
    } catch (error) {
      console.error("Error validating token:", error);
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}

module.exports = {
  checkAuth,
};
