import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const SYSTEM_PROMPT = `You are a trainable artificial intelligence model whose sole purpose is to read, understand, and reason over human knowledge contained in documents such as PDFs, PowerPoint presentations, Word files, and structured text after they have been converted into text and layout information; you are not a conversational agent but a document comprehension engine that identifies structure including titles, headings, sections, slide hierarchy, bullet points, tables, and references, builds deep semantic understanding by tracking concepts and intent across pages or slides, answers questions and produces summaries strictly grounded in the document as the single source of truth, explains complex ideas clearly without inventing information, extracts structured data when required, remains robust to OCR noise and imperfect formatting by reconstructing meaning from context, treats each document as a closed and complete knowledge domain during training and inference, prioritizes meaning and continuity over keyword matching, and operates with the goal of clarity, reliability, and faithful understanding rather than speed.`;

router.post("/chat", async (req, res) => {
  try {
    const { message, context } = req.body;
    console.log("[AI] Request Received for note:", context?.title);

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL: GEMINI_API_KEY is not set in environment!");
      return res
        .status(500)
        .json({ message: "AI Configuration error: API Key missing" });
    }

    // Re-initialize model to ensure it uses the correct API key from env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Build the context string from note content and attachments
    let contextString = `### Title: ${context.title || "Untitled"}\n\n`;
    contextString += `### Folder: ${context.folder || "General"}\n\n`;
    contextString += `### Content:\n${context.content || "(Empty)"}\n\n`;

    if (context.attachments && context.attachments.length > 0) {
      contextString += `### Attachments:\n`;
      context.attachments.forEach((att, index) => {
        contextString += `\n#### Attachment ${index + 1}: ${att.name}\n`;
        if (att.extractedText) {
          console.log(
            `[AI] Including text from: ${att.name} (${att.extractedText.length} chars)`
          );
          contextString += `(Extracted Content):\n${att.extractedText}\n---\n`;
        } else {
          contextString += `(No text extracted or unsupported format)\n---\n`;
        }
      });
    }

    console.log(`[AI] Context String Length: ${contextString.length} chars`);
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nHere is the document context:\n${contextString}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Understood. I have processed the document content and attachments. I am ready to answer questions grounded strictly in this information.",
            },
          ],
        },
      ],
    });

    console.log(`[AI] Sending message: "${message.substring(0, 50)}..."`);
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    console.log(`[AI] Response received: ${text.substring(0, 50)}...`);
    res.json({ response: text });
  } catch (error) {
    console.error("AI Error Detailed:", {
      message: error.message,
      status: error.status,
      statusText: error.statusText,
      errorDetails: error.errorDetails,
    });
    res.status(500).json({
      message: "Failed to generate AI response",
      error: error.message,
      errorDetails: error.errorDetails,
    });
  }
});

export default router;
