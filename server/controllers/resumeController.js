const multer = require("multer");
const path = require("path");
const fs = require("fs");
const parsePDF = require("../utils/parser");
const analyzeResume = require("../utils/scorer");
const Resume = require("../models/Resume");
const matchResumeToJob = require("../utils/matcher");
const generateFeedback = require("../utils/aiFeedback");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."), false);
    }
  }
}).single("resume");

const { validateResumeText } = require("../utils/validator");

// Controller
const uploadResume = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      const isMulterError = err instanceof multer.MulterError;
      return res.status(400).json({ error: isMulterError ? `Upload limit error: ${err.message}` : err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No resume file was uploaded." });
    }

    const filePath = req.file.path;

    try {
      const text = await parsePDF(filePath);
      
      // Validate if text looks like a resume (AI-powered check)
      const validation = await validateResumeText(text);
      if (!validation.isValid) {
        return res.status(400).json({ error: validation.reason });
      }

      const result = analyzeResume(text);

      const jobDescription = req.body.jobDescription || "";
      const matchResult = matchResumeToJob(text, jobDescription);

      // If no job description was provided, align general ATS score with match score (both capped at 80)
      if (matchResult.generalAnalysis) {
        result.score = matchResult.finalScore;
      }

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
        jobDescription: jobDescription,
      });

    } catch (error) {
      console.error("Resume upload error:", error.message);
      res.status(500).json({ error: "An internal server error occurred. Please try again." });
    } finally {
      // Clean up uploaded file
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error(`Failed to delete temp file ${filePath}:`, unlinkErr.message);
      });
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
    console.error("Get history error:", error.message);
    res.status(500).json({ error: "An internal server error occurred. Please try again." });
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
    console.error("Delete history error:", error.message);
    res.status(500).json({ error: "An internal server error occurred. Please try again." });
  }
};

const rewriteBulletPoint = async (req, res) => {
  try {
    const { bulletPoint, jobDescription, domain } = req.body;
    
    if (!bulletPoint) {
      return res.status(400).json({ error: "Bullet point text is required." });
    }

    const aiRewriter = require("../utils/aiRewriter");
    const aiResponse = await aiRewriter(bulletPoint, jobDescription, domain);
    
    res.json({ suggestions: aiResponse.suggestions });
  } catch (error) {
    console.error("Rewrite Bullet error:", error.message);
    res.status(500).json({ error: "An internal server error occurred while rewriting. Please try again." });
  }
};

const generateCoverLetterHandler = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ error: "Resume text is required." });
    }

    const generateCoverLetter = require("../utils/aiCoverLetter");
    const coverLetterText = await generateCoverLetter(resumeText, jobDescription);
    
    res.json({ coverLetter: coverLetterText });
  } catch (error) {
    console.error("Generate Cover Letter error:", error.message);
    res.status(500).json({ error: "An internal server error occurred while generating the cover letter. Please try again." });
  }
};

const mockInterviewHandler = async (req, res) => {
  try {
    const { message, history, resumeText, jobDescription } = req.body;
    
    if (!message || !resumeText) {
      return res.status(400).json({ error: "Message and resume text are required." });
    }

    const chatWithInterviewer = require("../utils/aiInterviewer");
    const reply = await chatWithInterviewer(message, history, resumeText, jobDescription);
    
    res.json({ reply });
  } catch (error) {
    console.error("Mock Interview error:", error.message);
    res.status(500).json({ error: "An internal server error occurred during the interview chat." });
  }
};

module.exports = { uploadResume, getHistory, deleteHistory, rewriteBulletPoint, generateCoverLetterHandler, mockInterviewHandler };