const { validateResumeText } = require("../utils/validator");

const testCases = [
  {
    name: "Valid Resume",
    text: "John Doe\nSoftware Engineer\nEXPERIENCE:\nWorked at TechCorp for 5 years.\nEDUCATION:\nBachelor of Science in Computer Science.\nSKILLS:\nReact, Node.js, JavaScript.",
    expected: true
  },
  {
    name: "Non-Resume PDF (e.g., a letter)",
    text: "Dear Sir/Madam,\nI am writing to you regarding the recent noise complaints in the neighborhood.\nPlease let us know when we can discuss this.\nRegards,\nA Citizen.",
    expected: false
  },
  {
    name: "Very Short Text",
    text: "Hello world.",
    expected: false
  }
];

console.log("--- Starting Local Validation Tests ---");

testCases.forEach((test, index) => {
  const result = validateResumeText(test.text);
  const passed = result.isValid === test.expected;
  
  console.log(`\nTest #${index + 1}: ${test.name}`);
  console.log(`Result: ${result.isValid ? "PASS (Valid Resume)" : "FAIL (Not a Resume)"}`);
  if (!result.isValid) console.log(`Reason: ${result.reason}`);
  console.log(`Status: ${passed ? "✅ OK" : "❌ FAILED"}`);
});

console.log("\n--- Tests Completed ---");
