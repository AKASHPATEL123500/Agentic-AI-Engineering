import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: "",
});

const weatherToolDeclaration = {
  name: "get_current_weather",
  description: "Live weather aur temperature nikalta hai kisi city ka",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description: "City ka naam jaise Prayagraj, Delhi",
      },
    },
    required: ["city"],
  },
};

async function runTest() {
  // Chat session create kiya
  const chat = ai.chats.create({
    model: "gemini-3.1-flash-lite",
    config: {
      systemInstruction:
        "You are a professional weather anchor. When you get data from tools, provide a very detailed, engaging, and comprehensive weather report in Hinglish. Include tips for citizens.",
      tools: [{ functionDeclarations: [weatherToolDeclaration] }],
    },
  });

  console.log("--- TURN 1: User Prompt bhej rahe hain ---");
  const response1 = await chat.sendMessage({
    message: "Delhi ka live mausam kaisa hai?",
  });

  console.log("\n[Turn 1 Output]:");
  console.log("Tool Calls:", JSON.stringify(response1.functionCalls, null, 2));

  // Agar model ne function call return kiya
  if (response1.functionCalls && response1.functionCalls.length > 0) {
    const call = response1.functionCalls[0];
    if (!call || !call.name) {
      console.error("No valid function call returned by model.");
      return;
    }
    console.log(`\nModel ne tool maanga: ${call.name} with args:`, call.args);

    // Dummy data banaya
    const dummyOutput = {
      location: "Delhi (NCR)",
      temp: "34°C",
      feels_like: "39°C due to high humidity",
      condition: "Partly cloudy with chances of thunderstorm in the evening",
      humidity: "78%",
      wind_speed: "15 km/h North-East",
      air_quality_index: "145 (Moderate)",
    };

    console.log("\n--- TURN 2: Dummy data wapas bhej rahe hain ---");

    // Chat session me direct functionResponse bhejte hain
    const response2 = await chat.sendMessage({
      message: [
        {
          functionResponse: {
            name: call.name,
            response: { result: dummyOutput },
          },
        },
      ],
    });

    console.log("\n[FINAL RESPONSE]:");
    console.log(response2.text);
  }
}

runTest();
