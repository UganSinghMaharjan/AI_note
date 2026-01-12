import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import path from "path";
import fs from "fs";
import officeparser from "officeparser";

const parsePDF = async function parsePDF(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return "";
    }

    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    await parser.destroy();
    return result.text || "";
  } catch (err) {
    console.error("PDF Parse Error:", err);
    throw err;
  }
};

const parseDocx = async (filePath) => {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value;
};

const parseOffice = async (filePath) => {
  try {
    return await officeparser.parseOfficeAsync(filePath);
  } catch (err) {
    console.error("Office Parser Error:", err);
    return "";
  }
};

const parseText = async (filePath) => {
  return fs.readFileSync(filePath, "utf8");
};

export const extractTextFromFile = async (file) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const filePath = path.resolve(file.path);

  try {
    switch (ext) {
      case ".pdf":
        return await parsePDF(filePath);
      case ".docx":
      case ".doc":
        return await parseDocx(filePath);
      case ".pptx":
      case ".ppt":
      case ".xlsx":
      case ".xls":
        return await parseOffice(filePath);
      case ".txt":
      case ".md":
      case ".json":
      case ".js":
      case ".html":
      case ".css":
        return await parseText(filePath);
      default:
        return ""; // Unsupported type, return empty string
    }
  } catch (error) {
    console.error(
      `Error parsing file ${file.originalname} at ${filePath}:`,
      error
    );
    return "";
  }
};
