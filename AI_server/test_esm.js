import { PDFParse } from "pdf-parse/node";
import fs from "fs";
import path from "path";

async function testParse() {
  const attachmentsDir = path.join(process.cwd(), "uploads", "attachments");
  try {
    const files = fs.readdirSync(attachmentsDir);
    if (files.length === 0) return;

    const filePath = path.join(attachmentsDir, files[0]);
    console.log("Testing pdf-parse/node for:", filePath);

    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    console.log("PDF Parsed successfully via pdf-parse/node.");
    console.log("Text length:", result.text?.length);
    await parser.destroy();
  } catch (err) {
    console.error("Node Entry Test Error:", err);
  }
}

testParse();
