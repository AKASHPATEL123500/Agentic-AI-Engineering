// 📄 level2-worker-sandbox.ts
import { Worker } from "node:worker_threads";

export function runLevel2Sandbox(
  code: string,
  timeoutMs: number = 2000,
): Promise<{ success: boolean; result?: any; error?: string }> {
  return new Promise((resolve) => {
    // Dynamic Worker Script inline JavaScript code string ke saath
    const workerCode = `
      const { parentPort, workerData } = require('node:worker_threads');
      const vm = require('node:vm');
      
      try {
        const safeContext = { Math, JSON, Date };
        const context = vm.createContext(safeContext);
        const script = new vm.Script(workerData.code);
        const res = script.runInContext(context);
        parentPort.postMessage({ success: true, result: res });
      } catch (err) {
        parentPort.postMessage({ success: false, error: err.message });
      }
    `;

    // Data URI standard ka use karke inline worker load karo
    const worker = new Worker(workerCode, {
      eval: true,
      workerData: { code },
    });

    // Main thread timeout logic setup karo
    const timer = setTimeout(() => {
      worker.terminate(); // 🚨 Background thread ko jaan se maar do!
      resolve({
        success: false,
        error: `🚨 Security Timeout: Script execution exceeded ${timeoutMs}ms limit.`,
      });
    }, timeoutMs);

    worker.on("message", (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });

    worker.on("error", (err: any) => {
      clearTimeout(timer);
      resolve({ success: false, error: err.message });
    });
  });
}

// 🧪 Test Level 2:
async function test() {
  console.log(await runLevel2Sandbox("while(true){}"));
  // Output: { success: false, error: '🚨 Security Timeout: Script execution exceeded 2000ms limit.' }
  // Tumhara main app/server bindas chalta rahega, crash nahi hoga!
}
test();
