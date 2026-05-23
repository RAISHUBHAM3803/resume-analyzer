const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const fs = require("fs");

// Load env FIRST before anything else
dotenv.config({ path: path.join(__dirname, ".env") });

// Fail fast if critical env vars are missing
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not set. Refusing to start.");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is not set. Refusing to start.");
  process.exit(1);
}

connectDB();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────
// 1. Helmet: sets secure HTTP response headers
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for React SPA
  crossOriginEmbedderPolicy: false,
}));

// 2. CORS: restrict to known origins in production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL, // Set this to your Render URL in production
].filter(Boolean);

app.use("/api", cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
}));

// 3. Body size limit: prevent payload flooding attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

// 4. Rate limiter: cap auth attempts at 20 requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { error: "Too many requests from this IP, please try again after 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 5. Upload rate limiter: cap resume uploads at 10 per 15 min
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Upload limit reached. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/resume", uploadLimiter, require("./routes/resumeRoutes"));

// ─── Serve Frontend in Production ─────────────────────────────────────────
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

// ─── Start ────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});
