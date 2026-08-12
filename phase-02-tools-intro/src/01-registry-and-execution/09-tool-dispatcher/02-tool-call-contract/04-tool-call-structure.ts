export interface ToolCallPayload {
  id: string;
  toolName: string;
  args: Record<string, any>;
  metadata?: {
    name: string;
    recivedAt: Date;
  };
}

// export interface RawLLMToolCall {
//   id?: string;
//   callId?: string;
//   name?: string;
//   function?: {
//     name?: string;
//     arguments?: string | Record<string, any>;
//   };
//   input?: Record<string, any>;
//   args?: Record<string, any>;
// }

export interface RawLLMToolCall {
  id?: string; // kai llm jo hai waha id send karte hai
  callId?: string; // kai llm callid send karte hai
  name?: string; // kai llm name send karte hai
  function?: {
    name?: string;
    arguments?: string | Record<string, any>;
  };
  input?: Record<string, any>;
  args?: Record<string, any>;

  // Next OpenAi ka rool
  tool_call?: Array<{
    id?: string;
    type?: string;
    function?: {
      name?: string;
      arguments?: string | Record<string, any>;
    };
  }>;
}
