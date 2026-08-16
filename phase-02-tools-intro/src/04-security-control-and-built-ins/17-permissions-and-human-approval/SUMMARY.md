### HITL (Human-in-the-loop)

**🗺️ HITL Security Gateway & Workflow Diagram**

> Yeh diagram dikhata hai ki jab LLM se request aati hai,
> toh tumhara security layer, decision engine aur CLI
> prompt aapas mein kaise coordinate karte hain:

```ts
[ LLM / Phase 04 Output ] (Raw Arguments)
            │
            ▼
[ validateToolArguments ] (Zod Schema Schema Check)
            │
            ▼
   [ ContextEngine ] (Injects User Session, e.g., role: "admin")
            │
            ▼
┌────────────────────────────────────────────────────────┐
│             secuirtyInterceptorSystem                  │
│                                                        │
│  1. Evaluate Policy (evaluateSecurityPolicy)           │
│     ├── Is Role Authorized?                            │
│     │     ├── NO  ──► [ DENIED ] ──► (Block Execution) │
│     │     └── YES ──► Check Risk / Approval Flag       │
│     │                                                  │
│     └── Does it need approval? (Risk: Critical/High)  │
│           ├── NO  ──► [ ALLOWED ] ──► (Direct Exec)   │
│           └── YES ──► [ REQUIRES_APPROVAL ]            │
│                             │                          │
└─────────────────────────────┼──────────────────────────┘
                              │
                              ▼
                [ humanAprovalCli Prompt ]
                     (Wait for User)
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
         [ User Denied ]               [ User Approved ]
               │                             │
               ▼                             ▼
        { procced: false }            { procced: true }
               │                             │
               ▼                             ▼
       (Halt Dispatcher)             [ ToolExecution ]
                                    (Execute & Log Memory)
```
