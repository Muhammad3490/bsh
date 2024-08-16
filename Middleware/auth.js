const { validateToken } = require('../Services/auth');

function checkAuth(cookieName) {
  return async (req, res, next) => {
    const userToken = req.cookies[cookieName];
    if (!userToken) return next(); 

  
    try {
      const payload = await validateToken(userToken);
      req.user = payload;
    } catch (error) {
      console.error("Error validating token:", error);
    }

    next(); 
  };
}

module.exports = {
  checkAuth
};
