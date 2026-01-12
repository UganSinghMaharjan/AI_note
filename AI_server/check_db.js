import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

import Note from "./models/Note.js";

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const notes = await Note.find({ "attachments.0": { $exists: true } });
    console.log(`Found ${notes.length} notes with attachments`);

    notes.forEach((n) => {
      console.log(`\nNote: ${n.title} (${n._id})`);
      n.attachments.forEach((a, i) => {
        console.log(`  Attachment ${i + 1}: ${a.name}`);
        console.log(
          `    Extracted Text Length: ${a.extractedText?.length || 0}`
        );
        if (a.extractedText) {
          console.log(
            `    Sample Content: ${a.extractedText.substring(0, 100)}...`
          );
        }
      });
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
