import fs from "fs";
import path from "path";
import { extractTextFromFile } from "./utils/fileParser.js";

async function testParse() {
  const attachmentsDir = path.join(process.cwd(), "uploads", "attachments");
  try {
    const files = fs.readdirSync(attachmentsDir);
    if (files.length === 0) {
      console.log("No files to test.");
      return;
    }

    const firstFile = files[0];
    const filePath = path.join(attachmentsDir, firstFile);

    // Mocking the file object that extractTextFromFile expects (multer file object)
    const mockFile = {
      originalname: firstFile,
      path: filePath,
      mimetype: "application/pdf",
    };

    console.log("--- Starting Extraction Test ---");
    const text = await extractTextFromFile(mockFile);
    console.log("--- Test Complete ---");

    if (text) {
      console.log("SUCCESS: Text was extracted.");
    } else {
      console.log("FAILURE: No text extracted.");
    }
  } catch (err) {
    console.error("Test Error:", err);
  }
}

testParse();
