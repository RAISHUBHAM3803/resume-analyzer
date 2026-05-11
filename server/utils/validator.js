/**
 * Validates if the provided text looks like a resume.
 * Checks for common resume sections and structure.
 */
const validateResumeText = (text) => {
  if (!text || text.trim().length < 100) return { isValid: false, reason: "File content is too short to be a resume." };

  const lowerText = text.toLowerCase();
  
  // Common resume headers/keywords
  const resumeKeywords = [
    "experience", 
    "work history", 
    "education", 
    "skills", 
    "contact", 
    "summary", 
    "projects", 
    "professional profile",
    "achievements",
    "certifications",
    "university",
    "college",
    "employment"
  ];

  // Count how many keywords are found
  const foundKeywords = resumeKeywords.filter(keyword => lowerText.includes(keyword));
  
  // If we find at least 3 distinct resume-related keywords, we consider it a likely resume.
  // This helps filter out random PDFs, eBooks, or notes.
  const MIN_KEYWORD_THRESHOLD = 3;

  if (foundKeywords.length < MIN_KEYWORD_THRESHOLD) {
    return { 
      isValid: false, 
      reason: "This file does not appear to be a resume. Please upload a valid resume containing sections like Education, Experience, and Skills." 
    };
  }

  return { isValid: true };
};

module.exports = { validateResumeText };
