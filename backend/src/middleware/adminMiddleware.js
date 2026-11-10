const asyncHandler = require("express-async-handler");

// Must run AFTER `protect`, which attaches req.user. Blocks any
// non-admin user from reaching admin-only routes (e.g. creating or
// deleting exercises).
const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    res.status(403);
    throw new Error("Admin access required");
  }
  next();
});

module.exports = { requireAdmin };
