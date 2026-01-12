import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/Note.js";

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB:", process.env.MONGODB_URI);

    const notes = await Note.find({});
    console.log(`Total notes found: ${notes.length}`);

    notes.forEach((n) => {
      console.log(
        `- ${n.title} (${n._id}) - Attachments: ${n.attachments?.length || 0}`
      );
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
