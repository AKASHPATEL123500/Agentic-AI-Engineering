export interface ToolCallPayload {
  id: string;
  toolName: string;
  args: Record<string, any>;
  metadata?: {
    name: string;
    recivedAt: Date;
  };
}

export interface LLMToolCallPayload {
  id?: string; // kai llm jo hai waha id send karte hai
  callId?: string; // kai llm callid send karte hai
  name?: string; // kai llm name send karte hai
  function?: {
    name?: string;
    arguments?: string | Record<string, any>;
  };
  input?: Record<string, any>;
  args?: Record<string, any>;

  tool_call?: Array<{
    id?: string;
    type?: string;
    function?: {
      name?: string;
      arguments?: string | Record<string, any>;
    };
  }>;
}
