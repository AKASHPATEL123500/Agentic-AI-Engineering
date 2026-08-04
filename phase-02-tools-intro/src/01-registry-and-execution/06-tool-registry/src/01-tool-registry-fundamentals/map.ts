// Map : ek super fast list hai jaha hum cheez ki name "Key" hoti hai and "Value" hoti hai

// Map ke ander hum jeyda tar "CRUD" opreation hi perfome karte hai jise ki
// 1. Naya Map Banana (Initialization)
// 2. set() => map mein set karna add karna
// 3. get() => map mein se get karna
// 4. delete() => delete karana
// 5. Check Karna Ki Tool Hai Ya Nahi hash() return --> true/false

// initlize the map
// const myMap = new Map<string,any>;   // aise bhi bana sakte hai
const myMap = new Map();

// myMap mein data set karna
// Syntax:  set(key,value)
myMap.set("weather_tool", { desc: "Check city weather", version: "1.0" });
myMap.set("calculator_tool", {
  desc: "Add or multiply numbers",
  version: "2.1",
});
console.log("Tools add ho gaye!");

// get karna
const data = myMap.get("weather_tool");
console.log("Get Data:", data);
console.log("Get Tool Desc:", data?.desc);
console.log("Tool Version:", data?.version);

// Check karna ki tool hai ya nahi
const isExists = myMap.has("weather_tool");
const randomCheck = myMap.has("delete_data");
console.log("Kya yaha exists karta hai: ", isExists);
console.log("Kya yaha exists karta hai: ", randomCheck);

// check map mein kitne tool hai
// Extra: Map Mein Kitne Tools Hain? (.size)
const toolLength = myMap.size;
console.log("Total length of my tool regsitry:", toolLength);

console.log("\n========================================\n");
// tool create
const agentRegistry = new Map();
// add tools
agentRegistry.set("get_weather", () => "Delhi mein aaj dhoop hai!");
agentRegistry.set("get_time", () => "Abhi shaam ke 6 baje hain.");

//  get datas
// LLM Query: get delhi wether
const toolName = "get_weather";

// check this tool is exist or not if exixt then exute by the throw error
if (agentRegistry.has(toolName)) {
  const runTool = agentRegistry.get(toolName);
  console.log(runTool());
} else {
  console.log("Sorry, mere paas ye tool nahi hai.");
}

// Delete a tools
agentRegistry.delete("calculator_tool");
console.log("Kya calculator tool hai:", agentRegistry.has("calculator_tool"));
// Output: Kya calculator tool hai: false

// Ek line mein: .forEach() ek aisa automatic loop hai jo Map ke andar baithe
//  har ek tool ke paas baari-baari (one by one)
// jata hai aur un par aapka bataya hua kaam karta hai.
