import Groq from "groq-sdk";
import { ToolRegistry } from "../phase-02-tools-intro/src/01-registry-and-execution/06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
const registry = new ToolRegistry();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testAgenticPipeline(userQuestion: string) {
  // 1. Apni tayar ki hui registry se direct LLM Schema nikalo!
  // Teri class ka `getLLMSchema()` method automatic array of tools return karega.
  const toolsFromRegistry = registry.getLLMSchema();

  const messages: Groq.Chat.ChatCompletionMessageParam[] = [
    { role: "user", content: userQuestion },
  ];

  console.log("🚀 LLM ko request bhej rahe hain tools ke sath...");

  // 2. Groq ko call lagao
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-specdec", // Groq ka super fast tool-use model
    messages: messages,
    tools: toolsFromRegistry as any, // Cast to any if types have slight strictness mismatch
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;
  messages.push(responseMessage);

  // 3. Check karo kya LLM kisi tool ko bulana chahta hai?
  if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
    console.log("🎯 LLM ne tool select kar liya!");

    for (const toolCall of responseMessage.tool_calls) {
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      console.log(
        `🔧 LLM chahta hai '${toolName}' tool chalana status ke sath:`,
        toolArgs,
      );

      // ===========================================================
      // 4. TERI REGISTRY SE TOOL NIKALO AUR EXECUTE KARO
      // ===========================================================
      try {
        // Registry se tool nikala (Nahi milega toh ToolNotFoundError throw hoga)
        const activeTool = registry.get(toolName);

        if (activeTool && activeTool.execute) {
          console.log(`⚙️ Executing tool: ${toolName}...`);

          // Tool ka actual function run karo
          const toolResult = await activeTool.execute(toolArgs, {});
          console.log("✅ Tool Output:", toolResult);

          // 5. Tool ke result ko wapas messages array mein push karo
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: toolName,
            content:
              typeof toolResult === "object"
                ? JSON.stringify(toolResult)
                : String(toolResult),
          });
        }
      } catch (error) {
        console.error("❌ Tool Chalane mein error aaya:", error);
        return;
      }
    }

    // 6. Loop Close: Tool execution ka data lekar LLM ke paas final answer ke liye jao
    console.log("🔄 Final answer ke liye LLM ko response bhej rahe hain...");
    const finalResponse = await groq.chat.completions.create({
      model: "llama-3.3-70b-specdec",
      messages: messages,
    });

    console.log(
      `\n📢 Final Agent Answer: ${finalResponse.choices[0].message.content}`,
    );
  } else {
    // Agar user ne aisa kuch pucha jisme tool ki zarurat hi nahi thi (e.g., "Hi, how are you?")
    console.log(`\n📢 LLM ka direct answer: ${responseMessage.content}`);
  }
}

// System ko test karo!
testAgenticPipeline("Delhi ka mausam kaisa hai?");
