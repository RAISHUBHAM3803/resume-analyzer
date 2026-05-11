const multer = require("multer");
const path = require("path");
const parsePDF = require("../utils/parser");
const analyzeResume = require("../utils/scorer");
const Resume = require("../models/Resume");
const matchResumeToJob = require("../utils/matcher");
const generateFeedback = require("../utils/aiFeedback");

// Storage config
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).single("resume");

const { validateResumeText } = require("../utils/validator");

// Controller
const uploadResume = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No resume file was uploaded." });
      }

      const filePath = req.file.path;
      const text = await parsePDF(filePath);
      
      // Validate if text looks like a resume
      const validation = validateResumeText(text);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.reason });
      }

      const result = analyzeResume(text);

      const jobDescription = req.body.jobDescription || "";
      const matchResult = matchResumeToJob(text, jobDescription);
      const aiResponse = await generateFeedback(text, result);

      const resumeData = {
        fileName: req.file.filename,
        text,
        score: result.score,
        skills: result.skills,
      };

      // Only save to DB if logged in, or we can always save but attach user
      if (req.user) {
        resumeData.user = req.user._id;
      }
      
      const newResume = new Resume(resumeData);
      await newResume.save();

      res.json({
        message: "Resume analyzed successfully",
        score: result.score,
        skills: result.skills,
        missingSkills: result.missingSkills,
        match: matchResult,
        domain: aiResponse.domain,
        feedback: aiResponse.feedback,
        questions: aiResponse.questions,
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};

const getHistory = async (req, res) => {
  try {
    const history = await Resume.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteHistory = async (req, res) => {
  try {
    const { timeframe } = req.query; // '1h', '24h', 'all'
    let query = { user: req.user._id };

    if (timeframe === '1h') {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      query.createdAt = { $gte: oneHourAgo };
    } else if (timeframe === '24h') {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      query.createdAt = { $gte: twentyFourHoursAgo };
    } else if (timeframe !== 'all') {
      return res.status(400).json({ error: "Invalid timeframe." });
    }

    const result = await Resume.deleteMany(query);
    res.json({ message: `Deleted ${result.deletedCount} history records.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadResume, getHistory, deleteHistory };