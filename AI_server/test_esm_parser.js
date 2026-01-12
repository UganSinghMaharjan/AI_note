import { PDFParse } from "pdf-parse";
import fs from "fs";
import path from "path";

async function testParse() {
  const attachmentsDir = path.join(process.cwd(), "uploads", "attachments");
  try {
    const files = fs.readdirSync(attachmentsDir);
    if (files.length === 0) {
      console.log("No files to test.");
      return;
    }

    const filePath = path.join(attachmentsDir, files[0]);
    console.log("Testing ESM parse for:", filePath);

    const dataBuffer = fs.readFileSync(filePath);

    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    console.log("PDF Parsed successfully.");
    console.log("Total pages:", result.total);
    console.log("Text length:", result.text?.length);
    console.log("Sample text:", result.text?.substring(0, 500));

    await parser.destroy();
  } catch (err) {
    console.error("ESM Test Error:", err);
  }
}

testParse();
