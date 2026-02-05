import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "Question is required" });
    }

    const geminiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are a DSA instructor.Answer the following question concisely and clearly:\n\n${question}`,
              }
            ]
          }
        ]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        }
      }
    );

    const answer =
      geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response received.";

    res.json({ answer });

  } catch (error) {
    console.error("🔥 Gemini Error:", error.response?.data || error.message);
    res.status(500).json({ answer: "AI server error" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
});
