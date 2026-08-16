import winston from "winston";

// ============================================================================
// 1. WINSTON LOGGER SETUP (ES Module Syntax)
// ============================================================================

// Terminal par clean aur readable formatting ke liye custom layout
const consoleFormat = winston.format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let msg = `[${timestamp}] [${level}]: ${message}`;

    // Agar context data (jaise tools ya token counts) pass kiya hai toh use properly format karein
    if (Object.keys(metadata).length > 0) {
      msg += ` \n📊 Context: ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  },
);

// Logger Instance Create aur Export karna
export const logger = winston.createLogger({
  level: "debug", // Scratch project ke liye debug mode open rakhein
  transports: [
    // Console Transport: Live debugging ke liye colorful output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: "HH:mm:ss" }),
        winston.format.colorize(),
        consoleFormat,
      ),
    }),
    // File Transport: Poore runtime analytics ko save karne ke liye JSON format
    new winston.transports.File({
      filename: "logs/agent_history.json",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});

// ============================================================================
// 2. DEMO AI AGENT WORKFLOW (Implementation Example)
// ============================================================================

export async function runAIAgent(userTask: string) {
  // Task receive hone par inform karein
  logger.info(`🤖 Agent Lifecycle Started`, { task: userTask });

  try {
    // Step 1: Simulated LLM Call (Reasoning Phase)
    logger.debug("Connecting to LLM for decision making...", {
      model: "gpt-4o",
      temp: 0.3,
    });

    // Fake LLM Response Object
    const llmDecision = {
      thought:
        "User wants to fetch global weather data. I should call the weather_api tool.",
      action: "call_tool",
      toolName: "weather_api",
      params: { location: "Mumbai" },
    };

    logger.info(`🧠 Agent Thought: ${llmDecision.thought}`);

    // Step 2: Simulated Tool Calling Phase
    if (llmDecision.action === "call_tool") {
      logger.warn(`🔧 Triggering Tool: [${llmDecision.toolName}]`, {
        input_params: llmDecision.params,
      });

      // Fake API Execution
      const mockResult = {
        status: "Success",
        temp: "28°C",
        condition: "Monsoon Rain",
      };

      logger.info(`✅ Tool [${llmDecision.toolName}] completed execution`, {
        output: mockResult,
      });
    }

    // Step 3: Final Response Token Logging
    logger.debug("Final prompt response generated", {
      token_usage: {
        prompt_tokens: 240,
        completion_tokens: 85,
        total_tokens: 325,
      },
    });
  } catch (error: any) {
    // Step 4: Error Tracking (Bohot critical phase)
    logger.error("❌ Agent crashed unexpectedly!", {
      reason: error.message,
      stack: error.stack,
    });
  }
}

// RUN THE DEMO: Is file ko directly test karne ke liye un-comment karein
// runAIAgent("Mumbai ka mausam kaisa hai?");
