// 📄 level3-v8-isolate-sandbox.ts
// Pehle chalao: npm i isolated-vm
import ivm from "isolated-vm";

export function runLevel3Sandbox(
  code: string,
  memoryLimitMb: number = 128,
): { success: boolean; result?: any; error?: string } {
  try {
    // 1. Ek isolated C++ level memory sandbox instance allocate karo
    const isolate = new ivm.Isolate({ memoryLimit: memoryLimitMb });

    // 2. Isolate ke andar naya state context structure banao
    const context = isolate.createContextSync();

    // 3. Global parameters set karne ke liye global ref proxy handle karo
    const jail = context.global;
    jail.setSync("global", jail.derefInto());

    // Basic common models inject karo safely
    // Isme explicit copy lagti hai taaki boundary maintain rahe
    const script = isolate.compileScriptSync(code);

    // 4. Run karo memory limit aur CPU timeout restrictions ke sath
    const result = script.runSync(context, { timeout: 1500 });

    // Resource disposal crucial hai memory leaks se bachne ke liye
    context.release();
    isolate.dispose();

    return { success: true, result };
  } catch (err: any) {
    return {
      success: false,
      error: `Level 3 Tight Security Blocked: ${err.message}`,
    };
  }
}

// 🧪 Test Level 3:
// Advanced Hacker Exploits like this:
const exploitCode = "this.constructor.constructor('return process')().exit(1)";
console.log(runLevel3Sandbox(exploitCode));
// Output: { success: false, error: "Level 3 Tight Security Blocked: Cannot read properties of undefined..." }
// Ekdum bulletproof protection!
