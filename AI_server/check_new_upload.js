import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/Note.js";

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const note = await Note.findById("696487db80f49c8160a0c0ad");

    if (note) {
      console.log("Found Note:", note.title);
      note.attachments.forEach((a, i) => {
        console.log(`Attachment ${i + 1}: ${a.name}`);
        console.log(`  Extracted Text Length: ${a.extractedText?.length || 0}`);
        if (a.extractedText) {
          console.log(`  Sample: ${a.extractedText.substring(0, 50)}...`);
        }
      });
    } else {
      console.log("Note not found.");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
