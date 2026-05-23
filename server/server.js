const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const fs = require("fs");

dotenv.config({ path: path.join(__dirname, ".env") });
connectDB();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/resume", require("./routes/resumeRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Serve Frontend in Production
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Production Server running on port ${PORT}`);
});
