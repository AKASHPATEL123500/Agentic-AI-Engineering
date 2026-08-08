import path from "node:path";

const absoluetPath = path.resolve("folder", "hello.txt");
console.log(absoluetPath);

// मान लीजिए आप 'C:/my-project' फोल्डर में हैं
const fullPath = path.resolve("folder", "file.txt");
console.log(fullPath);
// आउटपुट (Windows पर): C:\my-project\folder\file.txt
