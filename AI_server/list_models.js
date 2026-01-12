import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();

    if (data.models) {
      console.log("Models supporting generateContent:");
      data.models
        .filter((m) => m.supportedGenerationMethods.includes("generateContent"))
        .forEach((m) => {
          console.log(`- ${m.name}`);
        });
    } else {
      console.log("No models found or error in response:", data);
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
