import { ToolRegistry } from "../../06-tool-registry/src/03-core-operations-and-validation/02-crud-method-logic.ts";
// Aapka real weather tool path

import { WeatherTool } from "../../08-tool-loading-system/01-dynamic-module-importing/tools/weather.tool.ts";
import {
  CustomToolValidationError,
  validateToolArgumenst,
} from "./10-input-validation.ts";

// Step 1: Real registry banake tool ko register kar diya
const registry = new ToolRegistry({ strictValidation: true });
registry.register(WeatherTool);

console.log("🟢 Validation System Active & Testing Started...\n");

// ========================================================
// CASE 1: Sahi Saaman (Valid Input)
// ========================================================
const goodArgs = {
  countries: "india",
  city: "delhi",
  unit: "celsius",
};

try {
  const tool = registry.get("wather_tool"); // Phase 03 se tool mil gaya
  if (tool) {
    // Phase 04: Validate karo
    const cleanArgs = validateToolArgumenst(tool, goodArgs);
    console.log("✅ Case 1 Pass! Args are perfect for execution:", cleanArgs);
  }
} catch (err) {
  console.error("❌ Case 1 Unexpected Crash:", err);
}

console.log("\n--------------------------------------------------\n");

// ========================================================
// CASE 2: Galat Saaman (Invalid Input - LLM ne galti kar di)
// ========================================================
const badArgs = {
  countries: "america", // ❌ Galat Enum! (Allowed: india, singapore, vietnam, china)
  city: 12345, // ❌ Galat Type! (String chahiye tha, number bhej diya)
  unit: "celsius",
};

try {
  const tool = registry.get("wather_tool");
  if (tool) {
    console.log(
      "🔍 Case 2: Running bad arguments through validation engine...",
    );
    validateToolArgumenst(tool, badArgs); // Yeh line error throw karegi
  }
} catch (err) {
  // Humne bina crash huye error ko catch kiya
  if (err instanceof CustomToolValidationError) {
    console.log("🛑 Case 2 Pass! Validation engine caught the errors safely.");
    console.log("Tool Name:", err.toolName);
    console.log("Issues List From Zod:\n", err.issues.join("\n "));
  } else {
    console.error("❌ System crashed with unknown error:", err);
  }
}

// get_weather
// 🟢 Validation System Active & Testing Started...

// ✅ Case 1 Pass! Args are perfect for execution: { city: 'delhi', unit: 'celsius' }

// --------------------------------------------------

// 🔍 Case 2: Running bad arguments through validation engine...
// 🛑 Case 2 Pass! Validation engine caught the errors safely.
// Tool Name: wather_tool
// Issues List From Zod:
//  [Field: city] -> Invalid input: expected string, received number

// Bhai, aapka confusion ekdum genuine hai. Jab goodArgs mein teen cheezein (countries, city, unit) hain, toh output mein sirf city aur unit hi kyun bacha, iska poora logic Zod Schema Strip Mechanism par kaam karta hai.
// Isse point-to-point bina kisi faltu bakwaas ke samajhte hain.
// ## 1. Zod ka Default Behavior: .strip()
// Zod schema ka default rule hota hai Strip. Iska matlab hai ki jab aap kisi object ko parse karte hain, toh Zod sirf unhi keys ko aage bhejta hai jo uske schema mein defined hain. Jo keys schema mein nahi hain (jaise aapka countries), unhe Zod bina koi error throw kiye chupchap delete (ignore) kar deta hai.
// ## 2. Poora Flow: goodArgs se Function Tak
// Yeh hai aapka step-by-step data flow:

// [goodArgs Object] -> [validateToolArgumenst Function] -> [WeatherTool.parameters (Zod Schema)] -> [Filtered Output]

//    1. Aapka Input (goodArgs):
//    Aapne ek raw JavaScript object banaya:

//    const goodArgs = { countries: "india", city: "delhi", unit: "celsius" };

//    2. Function Call:
//    Aapne call kiya validateToolArgumenst(WeatherTool, goodArgs). Yahan goodArgs poore ke poora function ke andar pass hua.
//    3. Schema Extraction:
//    Function ke andar, code ne WeatherTool ke andar se uska Zod validation schema nikala. Weather Tool ka schema kuch aisa dikhta hai:

//    const WeatherToolSchema = z.object({
//      city: z.string(),
//      unit: z.enum(["celsius", "fahrenheit"])
//    });

//    Note: Is schema mein countries naam ki koi cheez defined nahi hai.
//    4. Parsing & Filtering (.parse()):
//    Function ke andar jab yeh line chalti hai:

//    const validData = WeatherToolSchema.parse(goodArgs);

//    Tab Zod background mein yeh step leta hai:
//    * city check kiya: Raw data mein hai aur string hai? Yes. (Keep it)
//       * unit check kiya: Raw data mein hai aur valid enum hai? Yes. (Keep it)
//       * countries check kiya: Raw data mein hai, par kya mere schema mein hai? No. Zod isko silently drop (remove) kar dega.
//    5. Final Output:
//    Zod validation ke baad jo validData return hota hai, usmein sirf vahi keys bachti hain jo successfully validate hui hain. Isiliye aapko output mein sirf { city: 'delhi', unit: 'celsius' } milta hai.

// ------------------------------
// ## 3. Agar aap chahte hain ki Extra Keys par Error aaye?
// Agar aap chahte hain ki countries pass karne par Zod error throw kare, toh aapko weather tool ke schema ke aage .strict() lagana padega:

// // Weather tool ke andar schema aisa hona chahiye agar error chahiye toh:const WeatherToolSchema = z.object({
//   city: z.string(),
//   unit: z.string()
// }).strict(); // Yeh extra keys aane par error de dega

// Bhai logic ekdum clear hai: Zod temporary extra data ko filter out karke system ko safe rakhta hai.
// Ab batao, yeh clear hai? Agar haan, toh Phase 05 par chalein?
