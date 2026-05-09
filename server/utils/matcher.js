const { techSkills } = require("./skillsDictionary");

const educationKeywords = [
  "B.Tech", "M.Tech", "Bachelor", "Master", "Computer Science", "PhD", "Degree", "University", 
  "College", "B.E", "B.S", "M.S", "BCA", "MCA", "B.Com", "M.Com", "MBA", "School", "Diploma"
];

const actionWords = ["developed", "built", "designed", "implemented", "created", "spearheaded", "managed", "optimized", "orchestrated"];

const contactPatterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/
};

const resumeSections = ["experience", "education", "projects", "skills", "summary", "contact"];

// Extract skills
const extractSkills = (text) => {
  const lowerText = text.toLowerCase();
  return techSkills.filter(skill =>
    lowerText.includes(skill.toLowerCase())
  );
};

// Experience detection
const extractExperienceScore = (text) => {
  let score = 0;
  const match = text.match(/(\d+)\+?\s*(years|yrs)/i);
  if (match) {
    const years = parseInt(match[1]);
    score = Math.min(years * 20, 100);
  } else if (text.toLowerCase().includes("intern")) {
    score = 40;
  }
  return score;
};

// Structure Check
const checkStructure = (text) => {
  const lowerText = text.toLowerCase();
  let found = 0;
  resumeSections.forEach(sec => {
    if (lowerText.includes(sec)) found++;
  });
  return Math.round((found / resumeSections.length) * 100);
};

// Contact Info Check
const checkContactInfo = (text) => {
  let score = 0;
  if (contactPatterns.email.test(text)) score += 40;
  if (contactPatterns.phone.test(text)) score += 40;
  if (contactPatterns.linkedin.test(text)) score += 20;
  return score;
};

// Education detection
const extractEducationScore = (text) => {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  educationKeywords.forEach(word => {
    if (lowerText.includes(word.toLowerCase())) {
      score += 35;
    }
  });

  if (text.match(/\b(B\.E|B\.S|M\.S|B\.Tech|M\.Tech|BCA|MCA|MBA)\b/i)) {
    score += 50;
  }

  return Math.min(score, 100);
};

// Action words
const extractActionScore = (text) => {
  let count = 0;
  actionWords.forEach(word => {
    if (text.toLowerCase().includes(word)) count++;
  });
  return Math.min(count * 15, 100);
};

// Keyword relevance
const keywordRelevance = (resumeText, jobText) => {
  const jobWords = jobText.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const resumeWords = resumeText.toLowerCase().split(/\W+/);
  if (jobWords.length === 0) return 0;
  let matchCount = 0;
  const uniqueJobWords = [...new Set(jobWords)];
  uniqueJobWords.forEach(word => {
    if (resumeWords.includes(word)) matchCount++;
  });
  return Math.min((matchCount / uniqueJobWords.length) * 100, 100);
};

// MAIN MATCH FUNCTION
const matchResumeToJob = (resumeText, jobText = "") => {
  const resumeSkills = extractSkills(resumeText);
  const isGeneralAnalysis = !jobText || jobText.trim().length < 10;

  let skillsScore, keywordScore, matchingSkills, missingSkills;

  if (isGeneralAnalysis) {
    matchingSkills = resumeSkills;
    missingSkills = [];
    skillsScore = Math.min((resumeSkills.length / 10) * 100, 100);
    keywordScore = extractActionScore(resumeText);
  } else {
    const jobSkills = extractSkills(jobText);
    matchingSkills = jobSkills.filter(skill =>
      resumeSkills.includes(skill)
    );
    skillsScore = jobSkills.length === 0 ? 0 : (matchingSkills.length / jobSkills.length) * 100;
    keywordScore = keywordRelevance(resumeText, jobText);
    missingSkills = jobSkills.filter(skill => !resumeSkills.includes(skill));
  }

  const experienceScore = extractExperienceScore(resumeText);
  const educationScore = extractEducationScore(resumeText);
  const structureScore = checkStructure(resumeText);
  const contactScore = checkContactInfo(resumeText);

  const finalScore = Math.round(
    0.40 * skillsScore +
    0.20 * keywordScore +
    0.15 * experienceScore +
    0.10 * educationScore +
    0.10 * structureScore +
    0.05 * contactScore
  );

  return {
    finalScore,
    skillsScore: Math.round(skillsScore),
    experienceScore,
    educationScore,
    keywordScore: Math.round(keywordScore),
    structureScore,
    contactScore,
    matchingSkills,
    missingSkills,
  };
};

module.exports = matchResumeToJob;
