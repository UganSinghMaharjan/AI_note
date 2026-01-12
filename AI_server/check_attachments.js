import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const noteSchema = new mongoose.Schema({
  title: String,
  attachments: [
    {
      name: String,
      extractedText: String,
    },
  ],
  user: mongoose.Schema.Types.ObjectId,
});

const Note = mongoose.model("Note", noteSchema);

async function checkRecentNotes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const recentNotes = await Note.find().sort({ updatedAt: -1 }).limit(5);

    recentNotes.forEach((note, i) => {
      console.log(`\nNote ${i + 1}: ${note.title} (${note._id})`);
      console.log(`Attachments: ${note.attachments.length}`);
      note.attachments.forEach((att, j) => {
        console.log(
          `  - Attachment ${j + 1}: ${att.name} (Text length: ${
            att.extractedText?.length || 0
          })`
        );
      });
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error:", err);
  }
}

checkRecentNotes();
