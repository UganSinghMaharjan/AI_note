import mongoose from "mongoose";
import dotenv from "dotenv";
import Note from "./models/Note.js";

dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const ids = ["6964a05bc434cde6a9b6cdb6", "6964a3d047a833fa5e028b42"];
    const notes = await Note.find({ _id: { $in: ids } });

    console.log(`Found ${notes.length} notes from the user's list.`);

    notes.forEach((n) => {
      console.log(`\nNote: ${n.title} (${n._id})`);
      console.log(`  Attachments Count: ${n.attachments?.length || 0}`);
      n.attachments.forEach((a, i) => {
        console.log(`  Attachment ${i + 1}: ${a.name}`);
        console.log(
          `    Extracted Text Length: ${a.extractedText?.length || 0}`
        );
        console.log(`    Path: ${a.path}`);
      });
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
