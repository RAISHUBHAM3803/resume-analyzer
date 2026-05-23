const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not set.");
}

const protect = async (req, res, next) => {
  let token;

  // 1. Prefer Authorization header (Bearer)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Fallback: read from HTTPOnly cookie
  if (!token && req.headers.cookie) {
    const cookieToken = req.headers.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="));
    if (cookieToken) {
      token = cookieToken.split("=")[1];
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch {
      // Don't leak error details — just return 401
      return res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    // Allow guests to proceed without req.user
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authorized, no token" });
  }
  next();
};

module.exports = { protect, requireAuth };
