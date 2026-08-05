import { getWatherTool } from "../../tools/get-weather-tool.ts";
import { registry } from "../register-tool.ts";

console.log(
  "\n--- SCENARIO 2: Blocking Duplicate Registration (Overwrite: False) ---",
);

try {
  // 1. Aapne duplicate tool register kiya
  registry.register(getWatherTool);

  // 2. 🚨 GADBAD YAHAN HAI: Agar register ne error throw NAHI ki, tabhi yeh line chalegi
  console.log("❌ [FAIL]: Registry ne duplicate tool allow kar diya!");
} catch (error: any) {
  // 3. 🎯 AGAR CODE SAHI HAI TOH RUNNER YAHAN AAYEGA!
  console.log(`✅ [PASS]: Duplicate block ho gaya!`);
}
