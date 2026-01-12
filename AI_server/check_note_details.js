import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/Note.js";

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const note = await Note.findById("6964a1069de9134b70b976d3");

    if (note) {
      console.log("Found Note:", note.title);
      console.log("Content Length:", note.content?.length || 0);
      console.log("Attachments:", JSON.stringify(note.attachments, null, 2));
    } else {
      console.log("Note not found.");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
