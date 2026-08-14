import type {
  ToolType,
  ToolContext,
  StandaradrizationToolResponse,
} from "../06-tool-registry/src/02-registry-contract-and-errors/src/types.ts";

/**
 * Execution status lifecycle flags
 */
type ExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "timed_out"
  | "aborted";

export interface ToolExecutionStandardResponse<TData = unknown> {
  exectionId: string;
  success: boolean;
  status: ExecutionStatus;
  requestId: string;
  // context
  context?: {
    name: string | null;
    userId: string | number;
    workinDir?: string;
    timestamps: number | string | null;
    role: string;
  };
  toolResponse: StandaradrizationToolResponse<TData> | null;
  // error
  engineError: {
    code: number;
    message: string;
    resion?: string;
    detials?: string;
  } | null;
  // 4. Performance & Audit Metrics (Crucial for Enterprise SLAs)
  metrics?: {
    startTime: string; // ISO Timestamp
    endTime: string | number | null; // ISO Timestamp
    durationMs: number; // Execution time in milliseconds
    costIncurred?: number; // Agar tool kisi paid third-party API ko call karta hai (e.g., Serper, Twilio)
  };
}
/**
 * Configurable options for a single tool execution run
 */

// Note: types.ts aapki vahi file hai jisme aapne ToolContext aur ToolType ka strict rule likha hai.

/**
 * 💡 1. Execution Options
 * Tool ko chalate waqt extra control karne ke liye (jaise ghadhi ka limit).
 */
export interface ExecutionOptions {
  timeoutMs?: number; // Max duration jo hum tool ko chalne ke liye denge (e.g., 5000ms)
  signal?: AbortSignal; // Native mechanism jisse hum chalti hui execution ko cancel kar sakein
}

/**
 * 💡 2. Tool Execution Request Payload
 * Jab dispatcher engine ko request bhejega, to wo is bundle mein saara saaman bhejega.
 */
export interface ToolExecutionRequest {
  tool: ToolType<any, any>; // Target tool object jo execute hoga
  args: Record<string, any>; // Saaf-suthre validated input arguments
  context: ToolContext; // Session details (userId, role, workingDir)
  options?: ExecutionOptions; // Timeout aur cancellation signals
}
// Use code with caution.🔍 Is 01 Number File Ka Asli MatlabBhai, isme humne koi chalta hua logic (function execution) nahi likha hai, bas do sidhe aur saral niyam (contracts) banaye hain:ExecutionOptions: Yeh batata hai ki jab bhi koi tool execute hone jayega, hum use ek limit de sakte hain (timeoutMs) aur agar beech mein cancel karna ho to ek signal de sakte hain.ToolExecutionRequest: Yeh ek master lifafa hai. Jab dispatcher bolega ki "Bhai, tool chalao", to wo is lifafe mein Tool, Args, Context, aur Options ko ek sath wrap karke bhejega.Bhai, 01 number file ka contract ekdam simple tarike se fit ho gaya dimaag mein?Agar haan, to mujhe batao fir hum agle piece 02-timeout-and-cancellation.ts par chalte hain jahan hum is timeoutMs aur signal ko live use karke time-bomb ka logic banayenge!
