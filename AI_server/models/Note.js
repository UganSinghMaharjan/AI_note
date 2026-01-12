import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
  folder: {
    type: String,
    default: "General",
  },
  tags: [String],
  summary: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [
    {
      name: String,
      url: String,
      path: String,
      size: Number,
      mimeType: String,
      extractedText: String,
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

const Note = mongoose.model("Note", noteSchema);

export default Note;
