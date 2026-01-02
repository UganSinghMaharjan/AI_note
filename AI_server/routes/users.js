import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Multer search for storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.userId}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

// Update Profile Route
router.put(
  "/profile",
  authMiddleware,
  upload.single("picture"),
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (req.file) {
        // If there's an uploaded file, update the picture URL
        // We'll store the relative path which will be served by express.static
        user.picture = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.json({
        message: "Profile updated successfully",
        user: {
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
