const { techSkills } = require("./skillsDictionary");

const resumeSections = ["experience", "education", "projects", "skills", "summary", "contact"];
const actionWords = ["developed", "built", "designed", "implemented", "created", "spearheaded", "managed", "optimized", "orchestrated"];
const contactPatterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  linkedin: /linkedin\.com\/in\/[a-zA-Z0-9-]+/
};

const analyzeResume = (text) => {
  let foundSkills = [];
  const lowerText = text.toLowerCase();

  // 1. Identify skills
  techSkills.forEach((skill) => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  // 2. Calculate Sections Score (max 30 pts)
  let foundSections = 0;
  resumeSections.forEach(sec => {
    if (lowerText.includes(sec)) foundSections++;
  });
  const sectionsScore = (foundSections / resumeSections.length) * 30;

  // 3. Calculate Contact Info Score (max 20 pts)
  let contactScore = 0;
  if (contactPatterns.email.test(text)) contactScore += 8;
  if (contactPatterns.phone.test(text)) contactScore += 8;
  if (contactPatterns.linkedin.test(text)) contactScore += 4;

  // 4. Action Words / Wording Quality Score (max 20 pts)
  let foundActionWords = 0;
  actionWords.forEach(word => {
    if (lowerText.includes(word)) foundActionWords++;
  });
  const actionWordScore = Math.min(foundActionWords * 4, 20);

  // 5. Skills Score (max 20 pts)
  // Give a good score if they have a healthy number of skills (e.g. 5-15)
  const skillsCount = foundSkills.length;
  let skillsScore = 0;
  if (skillsCount >= 8) skillsScore = 20;
  else if (skillsCount >= 5) skillsScore = 15;
  else if (skillsCount >= 2) skillsScore = 10;
  else if (skillsCount >= 1) skillsScore = 5;

  // 6. Formatting & Length Score (max 10 pts)
  const charCount = text.length;
  let lengthScore = 0;
  if (charCount >= 1500 && charCount <= 8000) lengthScore = 10;
  else if (charCount >= 800 && charCount <= 12000) lengthScore = 7;
  else lengthScore = 4;

  // Total ATS Score (max 100)
  const totalATSScore = Math.round(sectionsScore + contactScore + actionWordScore + skillsScore + lengthScore);

  return {
    score: totalATSScore,
    skills: foundSkills,
    missingSkills: techSkills.filter((s) => !foundSkills.includes(s)).slice(0, 5), // Only show top 5 missing
  };
};

module.exports = analyzeResume;
