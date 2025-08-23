const { verifyToken } = require("../services/authentication");

/**
 * Middleware to check authentication and authorization.
 * @param {string[]} [roles=[]] - The roles allowed to access the route.
 * @returns {function} - The middleware function.
 */
function checkForAuthentication(roles = []) {
  return function (req, res, next) {
    // Get token from header or cookie
    const token =
      req.headers["authorization"]?.split("Bearer ")[1] || req.cookies?.token;

    // If no token, set user to null and continue
    if (!token) {
      req.user = null;
      return next();
    }

    try {
      // Verify the token
      const user = verifyToken(token);
      req.user = user;
    } catch (error) {
      req.user = null;
    }

    // If no user after trying to verify, redirect to login
    if (!req.user) return res.render("login");

    // If roles are specified, check for authorization
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).end("Unauthorized");
    }

    return next();
  };
}

module.exports = {
  checkForAuthentication,
};