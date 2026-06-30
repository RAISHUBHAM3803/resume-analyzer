const fs = require("fs").promises;
const { PDFParse } = require("pdf-parse");

const parsePDF = async (filePath) => {
  let parser;
  try {
    const dataBuffer = await fs.readFile(filePath);
    parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    return result.text;
  } catch (error) {
    throw new Error("Failed to parse PDF: " + error.message);
  } finally {
    if (parser && typeof parser.destroy === "function") {
      try { await parser.destroy(); } catch (e) {}
    }
  }
};

module.exports = parsePDF;
