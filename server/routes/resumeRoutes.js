const express = require("express");
const router = express.Router();
const { uploadResume, getHistory, deleteHistory } = require("../controllers/resumeController");
const { protect, requireAuth } = require("../middleware/authMiddleware");

// Upload uses protect (so req.user is set if logged in, but not strictly required)
router.post("/upload", protect, uploadResume);

// History strictly requires login
router.get("/history", protect, requireAuth, getHistory);
router.delete("/history", protect, requireAuth, deleteHistory);

module.exports = router;
