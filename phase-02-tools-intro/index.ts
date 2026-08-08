import path from "node:path";
import fs from "node:fs/promises";

async function findTxtFiles() {
  // 1. फोल्डर की सभी फाइलों की लिस्ट लें
  const files = await fs.readdir(
    "./src/00-tool-anatomy/01-tool-interface-and-contract/01-Standard-interface-tool/src/tools",
  );

  // 2. हर फाइल का एक्सटेंशन चेक करें
  const txtFiles = files.filter((file) => path.extname(file) === ".ts");

  console.log("सिर्फ टेक्स्ट फाइल्स:", txtFiles);
}
findTxtFiles();
