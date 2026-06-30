const fs = require("fs").promises;
const pdfParse = require("pdf-parse");

const parsePDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    throw new Error("Failed to parse PDF: " + error.message);
  }
};

module.exports = parsePDF;
