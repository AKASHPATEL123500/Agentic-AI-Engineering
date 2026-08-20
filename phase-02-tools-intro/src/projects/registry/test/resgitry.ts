// const registry = new ToolRegistry({
//   allowOverWrite: true, // overwrite strict band hai
//   strictMetadataCheck: true,
//   strictValidation: true,
// });

// // Pehli baar register: Successfully ho jayega
// registry.register(getWeatherTool);

// // Doosri baar register (Same tool instance): Ab error throw hona chahiye!
// registry.register(getWeatherTool);

// console.log(registry);

// 1. Registry ko allowOverWrite: true ke sath shuru karein
const registry = new ToolRegistry({
  allowOverWrite: true, // <--- Ab overwrite true hai
  strictMetadataCheck: true,
  strictValidation: true,
});

// 2. Maan lijiye yeh aapka pehla tool hai (Version 1.0.0)
const weatherToolV1: IToolType = {
  ...getWeatherTool,
  version: "1.0.0",
};

// 3. Maan lijiye yeh aapka upgraded tool hai (Version 1.1.0)
const weatherToolV2: IToolType = {
  ...getWeatherTool,
  version: "1.1.0", // <--- Version badha diya
};

// 4. Maan lijiye yeh ek galat/purana tool hai (Version 1.0.0 ya lower)
const weatherToolOld: IToolType = {
  ...getWeatherTool,
  version: "1.0.0", // <--- Same ya chota version
};

// ---- TESTING RUN ----

console.log("--- Test 1: Registering V1 ---");
registry.register(weatherToolV1); // Output: Tool register successfully

console.log("\n--- Test 2: Registering V2 (Upgraded) ---");
registry.register(weatherToolV2); // Output: Upgrading tool... Tool register successfully

console.log("\n--- Registry State After Upgrade ---");
console.log(registry); // Aap dekhoge ki map me ab version '1.1.0' ho chuka hai!

console.log("\n--- Test 3: Registering Same/Older Version (Should Error) ---");
try {
  registry.register(weatherToolOld); // Yeh error throw karega kyunki version bada nahi hai!
} catch (error: any) {
  console.error("Success! Error caught:", error.message);
}
