```ts
get_weather
⏱️  Tool Registry Setup: 0.169ms

🟢 Phase 05 Test Started: Context Injection Engine...

👉 [Phase 04 Output] Validated Args: { countries: 'india', city: 'prayagraj', unit: 'celsius' }
👉 [Phase 05 Output] Secure Context Injected: {
  userId: 'user_vip_888',
  sessionId: 'session_token_xyz_123',
  role: 'admin',
  workingDir: 'D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\09-tool-dispatcher\\05-execution-context'
}

🛡️  Sending data to Security Interceptor...
│
◇  ⚠️  HIGH-RISK ACTION CONFIRMATION ──────────────────────────────────────────────────╮
│                                                                                      │
│  Tool: get_weather                                                                   │
│  Risk Level:  CRITICAL                                                               │
│  Arguments: {                                                                        │
│    "countries": "india",                                                             │
│    "city": "prayagraj",                                                              │
│    "unit": "celsius"                                                                 │
│  }                                                                                   │
│  Reason: Tool 'get_weather' is marked as high-risk and requires human confirmation.  │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────╯
│
◇  Kya aap is tool ko execute karne ki permission dete hain?
│  No, Cancel

🛑 [SECURITY BLOCK]: Agent execution halted.
{
  "success": false,
  "status": "denied",
  "message": "Action rejected: Human operator denied execution permission.",
  "data": null,
  "error": {
    "code": 401,
    "message": "HUMAN_APPROVAL_REJECTED"
  },
  "meta": {
    "executionTimeMs": 0,
    "timestamps": 1786862866055,
    "requestId": "sec_req_1786862866055",
    "agent": {
      "name": "SecurityGateway",
      "version": "1.0.0",
      "status": "failed"
    },
    "toolDetails": {
      "name": "get_weather",
      "descriptions": "Fetches current weather information for a given city.",
      "version": "1.0.0"
    }
  }
}
```

### Success

```ts
get_weather
⏱️  Tool Registry Setup: 0.311ms

🟢 Phase 05 Test Started: Context Injection Engine...

👉 [Phase 04 Output] Validated Args: { countries: 'india', city: 'prayagraj', unit: 'celsius' }
👉 [Phase 05 Output] Secure Context Injected: {
  userId: 'user_vip_888',
  sessionId: 'session_token_xyz_123',
  role: 'admin',
  workingDir: 'D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\09-tool-dispatcher\\05-execution-context'
}

🛡️  Sending data to Security Interceptor...
│
◇  ⚠️  HIGH-RISK ACTION CONFIRMATION ──────────────────────────────────────────────────╮
│                                                                                      │
│  Tool: get_weather                                                                   │
│  Risk Level:  CRITICAL                                                               │
│  Arguments: {                                                                        │
│    "countries": "india",                                                             │
│    "city": "prayagraj",                                                              │
│    "unit": "celsius"                                                                 │
│  }                                                                                   │
│  Reason: Tool 'get_weather' is marked as high-risk and requires human confirmation.  │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────╯
│
◇  Kya aap is tool ko execute karne ki permission dete hain?
│  Yes, Execute

🚀 Security Cleared! Triggering ToolExecution...

✅ Tool Executed Successfully! Standardized Response:
{
  "exectionId": "12a6d6b8-e673-4286-ad3c-b5fb193c4cc1",
  "requestId": "12a6d6b8-e673-4286-ad3c-b5fb193c4cc1",
  "success": true,
  "status": "completed",
  "context": {
    "name": "user",
    "userId": "user_vip_888",
    "role": "admin",
    "workinDir": "D:\\agentic-ai-engineering\\phase-02-tools-intro\\src\\01-registry-and-execution\\09-tool-dispatcher\\05-execution-context",
    "timestamps": 1786863039940
  },
  "toolResponse": {
    "success": true,
    "status": "success",
    "message": "Weather fetched successfully with historical log.",
    "data": {
      "currentWeather": {
        "countries": "india",
        "city": "prayagraj",
        "unit": "celsius",
        "temptrauter": 25.3,
        "humnidity": 122,
        "condition": "Today is cloudy",
        "IQ": 123
      },
      "searchHistory": [
        {
          "countries": "india",
          "city": "prayagraj",
          "unit": "celsius"
        }
      ]
    },
    "error": null,
    "meta": {
      "executionTimeMs": 0,
      "timestamps": 1786863039940,
      "requestId": "02e80c59-6ef9-4164-8fab-98c3212cc809",
      "agent": {
        "name": "WeatherAgent",
        "version": "1.0.0",
        "status": "complete"
      },
      "toolDetails": {
        "name": "get_weather",
        "description": "Fetches current weather information for a given city.",
        "version": "1.0.0"
      }
    }
  },
  "engineError": null,
  "metrics": {
    "startTime": "2026-08-16T06:50:39.939Z",
    "endTime": 3874.3892,
    "durationMs": 3873.5585
  }
}
```
