// import chalk from "chalk";
// import figlet from "figlet";
// import gradient from "gradient-string";

// /**
//  * 👑 Mega Size Spaced-Out Luxury Banner Engine
//  */
// export async function print3DBanner(text: string) {
//   let asciiText = "";

//   try {
//     // 'Ghost' font letters ko ekdam bada, massive aur proper dynamic gaps ke saath build karta hai
//     asciiText = figlet.textSync(text, {
//       font: "Ghost",
//       horizontalLayout: "full", // Leters ke bich ka gap maximum aur clean rakhta hai
//       verticalLayout: "default",
//     });
//   } catch {
//     // Fallback blocky structure agar ghost script ready na ho
//     asciiText = figlet.textSync(text, {
//       font: "Big",
//       horizontalLayout: "full",
//     });
//   }

//   // 🛠️ Premium Technical Border Lines
//   const topBorder = chalk.hex("#444444")(
//     "═══════════════════════════════════════════════════════════════════════",
//   );
//   const bottomBorder = chalk.hex("#444444")(
//     "═══════════════════════════════════════════════════════════════════════",
//   );

//   // 🔥 Fiery Neon Core & Pure Gold Rich Blend Gradient (Ekdam Solid Color)
//   const premiumSolidGlow = gradient([
//     "#FF0055", // Intense Crimson Neon Edge
//     "#FF5500", // Fiery Electro Orange
//     "#FFCC00", // Bright Cyber Gold
//     "#FFFFE0", // Soft Sunlit Diamond Crown
//   ]);

//   console.log("\n" + topBorder);

//   // Pure text block ko empty rows se bacha kar dynamically heavy color feed kar rahe hain
//   const lines = asciiText.split("\n");
//   for (const line of lines) {
//     if (line.trim().length > 0) {
//       // Har line ko complete color mapping dekar output console me throw kiya
//       console.log(premiumSolidGlow(line));
//     }
//   }

//   console.log(bottomBorder + "\n");
// }

// /**
//  * ⚡ Executive Telemetry Entry Pipeline
//  */
// export async function runWakeUp() {
//   // Console window screen ko cleanly format buffer aur pointer wipe diya
//   process.stdout.write("\x1b[2J\x1b[0;0H");

//   // Execution call for the massive spaced-out banner
//   await print3DBanner("AI AGENT");
// }
import { Chalk } from "chalk";
import figlet from "figlet";

const chalk = new Chalk();

export async function print3DBanner(text: string) {
  let asciiText = "";

  try {
    asciiText = figlet.textSync(text, {
      font: "ANSI Shadow",
      horizontalLayout: "full",
    });
  } catch {
    asciiText = figlet.textSync(text, {
      font: "Standard",
      horizontalLayout: "full",
    });
  }

  const cream = chalk.hex("#FDF6E3");

  console.log();
  for (const line of asciiText.split("\n").filter((l) => l.trim().length > 0)) {
    console.log(cream("  " + line));
  }
  console.log();
}

export async function runWakeUp() {
  process.stdout.write("\x1b[2J\x1b[0;0H");
  await print3DBanner("A I A G E N T");
}
