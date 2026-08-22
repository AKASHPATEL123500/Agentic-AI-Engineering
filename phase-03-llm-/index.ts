import { GoogleGenAI } from "@google/genai";

// Explicitly pass the API key object
const ai = new GoogleGenAI({
  apiKey: "**************************",
});

async function startChat() {
  const chat = ai.chats.create({ model: "gemini-3.1-flash-lite" });
  let response = await chat.sendMessage({
    message: "hi how are you.",
  });
  console.log("AI:", response.text);
}

startChat();
