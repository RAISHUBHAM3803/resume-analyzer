const { techSkills } = require("./skillsDictionary");

const analyzeResume = (text) => {
  let foundSkills = [];
  let score = 0;
  
  const lowerText = text.toLowerCase();

  techSkills.forEach((skill) => {
    // Convert to lowercase for accurate matching
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
      score += 2; // Reduced per-skill score since we are checking 100+ skills
    }
  });

  // Cap the skills score at 100 for the general resume score calculation
  const finalScore = Math.min(score, 100);

  return {
    score: finalScore,
    skills: foundSkills,
    missingSkills: techSkills.filter((s) => !foundSkills.includes(s)).slice(0, 5), // Only show top 5 missing to avoid clutter
  };
};

module.exports = analyzeResume;
