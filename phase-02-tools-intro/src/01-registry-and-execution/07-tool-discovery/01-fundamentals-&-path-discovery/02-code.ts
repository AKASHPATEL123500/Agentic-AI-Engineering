import fs from "node:fs/promises";
import path from "node:path";
// async function listFiles() {
//   try {
//     // वर्तमान फोल्डर ('.') की सभी फाइलों की लिस्ट लाएगा
//     const files = await fs.readdir(".");
//     console.log(files);
//     // आउटपुट: ['index.js', 'package.json', 'images', 'resume.pdf']
//   } catch (error) {
//     console.error("फोल्डर नहीं पढ़ा जा सका:", error);
//   }
// }
// listFiles();

// async function findTxtFiles() {
//   // 1. फोल्डर की सभी फाइलों की लिस्ट लें
//   const files = await fs.readdir(".");

//   // 2. हर फाइल का एक्सटेंशन चेक करें
//   const txtFiles = files.filter((file) => path.extname(file) === ".ts");

//   console.log("सिर्फ टेक्स्ट फाइल्स:", txtFiles);
// }
// findTxtFiles();
