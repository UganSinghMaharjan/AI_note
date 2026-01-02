import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Note from "../models/Note.js";

const router = express.Router();

// Multer configuration for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/attachments/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.params.id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

// GET all notes for current user
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ... (other note routes) ...

// ATTACH file to note
router.post("/:id/attachments", upload.single("file"), async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const attachment = {
      name: req.file.originalname,
      url: `/uploads/attachments/${req.file.filename}`,
      path: req.file.path,
      size: req.file.size,
    };

    note.attachments.push(attachment);
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE attachment from note
router.delete("/:id/attachments/:attachmentId", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const attachment = note.attachments.id(req.params.attachmentId);
    if (!attachment)
      return res.status(404).json({ message: "Attachment not found" });

    // Remove file from filesystem
    if (fs.existsSync(attachment.path)) {
      fs.unlinkSync(attachment.path);
    }

    note.attachments.pull(req.params.attachmentId);
    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single note
router.get("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE note
router.post("/", async (req, res) => {
  const note = new Note({
    title: req.body.title || "Untitled",
    content: req.body.content || "",
    tags: req.body.tags || [],
    user: req.userId,
  });

  try {
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE note
router.patch("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (req.body.title != null) note.title = req.body.title;
    if (req.body.content != null) note.content = req.body.content;
    if (req.body.tags != null) note.tags = req.body.tags;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE note
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Optional: Delete all attachments files too
    for (const attachment of note.attachments) {
      if (fs.existsSync(attachment.path)) {
        fs.unlinkSync(attachment.path);
      }
    }

    await note.deleteOne();
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// BULK DELETE notes
router.delete("/", async (req, res) => {
  try {
    const { count } = req.query;
    if (count) {
      // Delete 'count' oldest notes
      const limit = parseInt(count);
      const notesToDelete = await Note.find({ user: req.userId })
        .sort({ createdAt: 1 })
        .limit(limit);

      for (const note of notesToDelete) {
        for (const attachment of note.attachments) {
          if (fs.existsSync(attachment.path)) {
            fs.unlinkSync(attachment.path);
          }
        }
      }

      const ids = notesToDelete.map((n) => n._id);
      await Note.deleteMany({ _id: { $in: ids } });
      res.json({ message: `${ids.length} oldest notes deleted` });
    } else {
      // Delete ALL notes for this user
      const allNotes = await Note.find({ user: req.userId });
      for (const note of allNotes) {
        for (const attachment of note.attachments) {
          if (fs.existsSync(attachment.path)) {
            fs.unlinkSync(attachment.path);
          }
        }
      }
      await Note.deleteMany({ user: req.userId });
      res.json({ message: "All notes deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
