const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getCurrentUser, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect, requireAuth } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, requireAuth, getCurrentUser);

router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

module.exports = router;
