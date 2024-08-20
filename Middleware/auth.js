const { validateToken } = require("../Services/auth");

function checkAuth() {
  return async (req, res, next) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const userToken = authHeader && authHeader.split(" ")[1]; // Extract the token after "Bearer"

    // If no token is provided, respond with 401 (Unauthorized)
    if (!userToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      // Validate the token using your token validation service
      const payload = await validateToken(userToken);

      // Attach the user payload to the request object for further use
      req.user = payload;

      // Move to the next middleware or route handler
      next();
    } catch (error) {
      console.error("Error validating token:", error);

      // If token validation fails, respond with 403 (Forbidden)
      return res.status(403).json({ error: "Forbidden" });
    }
  };
}

module.exports = {
  checkAuth,
};
