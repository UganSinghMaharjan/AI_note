import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import noteRoutes from "./routes/notes.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import authMiddleware from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", authMiddleware, noteRoutes);
app.use("/api/users", authMiddleware, userRoutes);

app.get("/", (req, res) => {
  res.send("AI Notes Server Running");
});

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
