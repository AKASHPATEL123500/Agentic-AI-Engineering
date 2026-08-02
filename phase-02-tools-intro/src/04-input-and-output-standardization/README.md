### Ab tak humne:

```bash
Ab tak humne:
1. Tool Fundamentals & Contract clear kiya.
2. Execution Context ko integrate karke isolation aur security samjhi.
3. Tool Anatomy ke saare 5 components ko practically build aur test karke dekh liya.
```

### Input and Output Standriztaion

**Input**: Input standrization ka mtlb hai ki ek rule set karna aur ussi rule se tool ko input diya jayega
**Output**: Output mein bhi same hi hoga taki ek tool jo output de waha ek rule ke hisab se

So All in All standrization ka mtlb hai ki input and output ka ek rule set kar dena aur waha issi rule ke hisab se input and output deneg

### Build a interface for standard input nd output

```ts
export interface StandaradInputAndOtputTool<TData = unknown> {
  success: boolean; // success boolean true or false
  status: boolean | "success" | "false" | "denied";
  message?: string; // message optional
  data: TData | null; // if data is exist then retrun by the way null retrun
  error: {
    code: string;
    message: string;
  };
  meta: {
    executionTimeMs: number;
    timestamps: number;
    requestId: string;
    agent: {
      name: string;
      version: string;
      status:
        | "success"
        | "compelete"
        | "faild"
        | "max-reached"
        | "unknown"
        | "guest-error"
        | "unauthrozied"
        | "in-progress";
    };
    toolDetails: {
      name: string;
      description: string;
      version: string;
    };
  };
}
```

_So yahi sab hai ek tool ka input and ouptut standrariztaion taki sabhi tool ek set-of-rule follow kare and consistency bani rahe_

### Uses

- Here we can use it in tool

- let assume hamara tool hai khuch

```ts
interface TData {
    filename:string,
    and more..
}
export const readFileTool:ToolType<typeof readFileSchema, TOutput or TData>
```
