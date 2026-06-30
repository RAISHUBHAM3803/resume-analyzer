const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { uploadResume, getHistory, deleteHistory } = require("../controllers/resumeController");
const { protect, requireAuth } = require("../middleware/authMiddleware");

// Rate limit only the upload endpoint (10 uploads per 15 min per IP)
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Upload limit reached. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Upload uses protect (so req.user is set if logged in, but not strictly required)
router.post("/upload", uploadLimiter, protect, uploadResume);

// History strictly requires login
router.get("/history", protect, requireAuth, getHistory);
router.delete("/history", protect, requireAuth, deleteHistory);

module.exports = router;
