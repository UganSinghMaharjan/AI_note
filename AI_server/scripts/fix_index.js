import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const fixIndex = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");

    const collection = mongoose.connection.collection("users");

    // Check existing indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    const googleIdIndex = indexes.find((idx) => idx.key.googleId === 1);

    if (googleIdIndex) {
      console.log(`Dropping index: ${googleIdIndex.name}`);
      await collection.dropIndex(googleIdIndex.name);
      console.log("Index dropped successfully.");
    } else {
      console.log(
        "googleId index not found. It might have been already dropped or never existed."
      );
    }

    // Force Mongoose to sync indexes (optional here as app restart triggers it, but good for verification)
    // await User.syncIndexes();

    console.log("Done.");
  } catch (error) {
    console.error("Error fixing index:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

fixIndex();
