const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  fileName: String,
  text: String,
  score: Number,
  skills: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for user history queries
resumeSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Resume", resumeSchema);
