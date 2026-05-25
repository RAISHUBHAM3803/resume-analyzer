/**
 * Validates if the provided text looks like a resume.
 * Checks for common resume sections and structure.
 */
const validateResumeText = (text) => {
  if (!text || text.trim().length < 100) {
    return { isValid: false, reason: "File content is too short to be a resume." };
  }

  const lowerText = text.toLowerCase();

  // 1. Core Contact Information Check (email or phone)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);

  // 2. Section presence check (Experience, Education, Skills)
  const experienceKeywords = ["experience", "work history", "employment", "professional history", "job history", "working history", "career history"];
  const educationKeywords = ["education", "academic", "university", "college", "degree", "school", "academics", "educational"];
  const skillsKeywords = ["skills", "technologies", "technical skills", "tools", "expertise", "competencies"];

  const hasExperienceSection = experienceKeywords.some(keyword => lowerText.includes(keyword));
  const hasEducationSection = educationKeywords.some(keyword => lowerText.includes(keyword));
  const hasSkillsSection = skillsKeywords.some(keyword => lowerText.includes(keyword));

  // Determine if it has enough core structural components
  let matchedSectionsCount = 0;
  if (hasExperienceSection) matchedSectionsCount++;
  if (hasEducationSection) matchedSectionsCount++;
  if (hasSkillsSection) matchedSectionsCount++;

  const hasContactInfo = hasEmail || hasPhone;
  const hasAllThreeSections = hasExperienceSection && hasEducationSection && hasSkillsSection;

  // A valid resume must have contact info AND at least 2 core sections, OR have all 3 core sections.
  // This filters out random documents (like exams, papers, stories) while preserving privacy-focused resumes.
  if ((!hasContactInfo || matchedSectionsCount < 2) && !hasAllThreeSections) {
    return {
      isValid: false,
      reason: "This file does not appear to be a resume. Please upload a valid resume containing clear sections like Education, Experience, and Skills, along with contact details."
    };
  }

  return { isValid: true };
};

module.exports = { validateResumeText };
