import winston from "winston";
import { Readable } from "stream";

// ============================================================================
// 1. WINSTON LOGGER SETUP
// ============================================================================
const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        }),
      ),
    }),
  ],
});

// ============================================================================
// 2. SIMULATING LLM STREAMING (Real-Time Chunk Generation)
// ============================================================================

// Yeh function mock karta hai jaise OpenAI ya Ollama se live words aa rahe hon
function simulateLLMStream(prompt: any) {
  const words =
    `Main aapka AI Agent hoon. Aapne mujhse poochha: "${prompt}". Main abhi aapke task par kaam kar raha hoon...`.split(
      " ",
    );

  let index = 0;
  return new Readable({
    read() {
      if (index < words.length) {
        // Har 200ms mein ek word bhej rahe hain (Streaming Effect)
        setTimeout(() => {
          this.push(words[index] + " ");
          index++;
        }, 200);
      } else {
        this.push(null); // Stream khatam
      }
    },
  });
}

// ============================================================================
// 3. AGENT WORKFLOW WITH STREAM HANDLING
// ============================================================================
export async function runStreamingAgent() {
  const prompt = "Aap kaun ho?";
  logger.info(`🚀 User Prompt received: "${prompt}"`);
  logger.debug("Starting LLM Response Stream...");

  // Stream initialize karna
  const llmStream = simulateLLMStream(prompt);

  let fullResponse = "";
  process.stdout.write("🤖 AI Response: "); // Terminal par response line start karne ke liye

  // 'data' event har baar trigger hota hai jab LLM se ek naya chunk (tukda) aata hai
  llmStream.on("data", (chunk) => {
    const textChunk = chunk.toString();
    fullResponse += textChunk;

    // Live terminal par print kar rahe hain (Bina new line ke)
    process.stdout.write(textChunk);
  });

  // 'end' event tab trigger hota hai jab poori stream khatam ho jaati hai
  llmStream.on("end", () => {
    console.log("\n"); // Live typing khatam hone par line break
    logger.info("✅ Stream completed successfully.");

    // Poora response ek sath Winston log file ya dashboard mein save karne ke liye
    logger.debug("Final Saved Response", {
      complete_text: fullResponse.trim(),
    });
  });

  llmStream.on("error", (err) => {
    logger.error("❌ Error occurred during streaming", { error: err.message });
  });
}

// Code ko test karne ke liye function call
runStreamingAgent();
