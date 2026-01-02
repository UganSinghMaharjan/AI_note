import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// GET all notes for current user
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
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

      const ids = notesToDelete.map((n) => n._id);
      await Note.deleteMany({ _id: { $in: ids } });
      res.json({ message: `${ids.length} oldest notes deleted` });
    } else {
      // Delete ALL notes for this user
      await Note.deleteMany({ user: req.userId });
      res.json({ message: "All notes deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
