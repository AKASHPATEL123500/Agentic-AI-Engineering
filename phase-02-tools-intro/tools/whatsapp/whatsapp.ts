// import makeWASocket, {
//   useMultiFileAuthState,
//   DisconnectReason,
//   proto,
// } from "@whiskeysockets/baileys";

// // qrcode-terminal does not ship TypeScript declarations
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// // @ts-ignore
// const qrcode = require("qrcode-terminal");

// export async function connectWhatsApp(): Promise<void> {
//   // 1. User ke login credentials save karne ke liye folder banega
//   const { state, saveCreds } = await useMultiFileAuthState("whatsapp_session");

//   // 2. WhatsApp connection socket shuru karo
//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: false, // Hum custom tarike se terminal mein print karenge
//   });

//   // 3. Connection status aur QR code monitor karo
//   sock.ev.on("connection.update", (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     // A. Agar naya QR Code aaya hai, toh terminal mein bada dikhao
//     if (qr) {
//       console.clear();
//       console.log("=========================================");
//       console.log("📲 APNE PHONE SE IS QR CODE KO SCAN KARO:");
//       console.log("=========================================");
//       qrcode.generate(qr, { small: true });
//     }

//     // B. Jaise hi user scan kar lega aur connect ho jayega
//     if (connection === "open") {
//       console.clear();
//       console.log(
//         "🎉 Mubarak ho! User ka WhatsApp successfully connect ho gaya hai!",
//       );
//     }

//     // C. Agar connection toot jaye (Internet issue ya Logout karne par)
//     if (connection === "close") {
//       const error = lastDisconnect?.error as any; // Avoid strict nested type check errors
//       const shouldReconnect =
//         error &&
//         "output" in error &&
//         error.output?.statusCode !== DisconnectReason.loggedOut;

//       console.log(
//         "Connection close ho gaya. Kya wapas connect karein?",
//         shouldReconnect,
//       );
//       if (shouldReconnect) {
//         connectWhatsApp(); // Wapas try karo
//       }
//     }
//   });

//   // 4. Credentials update hone par unhe automatically save karo
//   sock.ev.on("creds.update", saveCreds);

//   // 5. Jab bhi koi user aapko WhatsApp par naya message bhejega
//   sock.ev.on("messages.upsert", async (m) => {
//     const msg: proto.IWebMessageInfo | undefined = m.messages?.[0]; // Type safety for message item
//     if (!msg || !msg.message) return;

//     // Agar message aapne khud nahi bheja hai
//     if (!msg.key.fromMe) {
//       // Alag-alag tarike ke text messages ko handle karne ke liye strict string default fallback
//       const incomingText: string = (
//         msg.message.conversation ||
//         msg.message.extendedTextMessage?.text ||
//         ""
//       ).trim();

//       const senderNumber: string | null | undefined = msg.key.remoteJid; // Bhejne wale ka WhatsApp ID (Number)
//       if (!senderNumber) return;

//       console.log(
//         `📩 Naya Message Aaya From [${senderNumber}]: ${incomingText}`,
//       );

//       // 🛑 CUSTOM MENU LOGIC STARTS HERE 🛑

//       // 1. Menu Trigger (Hi, Hello, Hey, Menu, Help, Bhai)
//       if (/^(hi|hello|hey|menu|help|bhai)$/i.test(incomingText)) {
//         console.log("🤖 AI Agent Menu reply bhej raha hai...");
//         const welcomeMessage =
//           `👋 *Hello Boss! Main aapka Personal AI Agent hoon.*\n\n` +
//           `Bun backend aur WhatsApp integration ekdam successfully chal raha hai! 🔥\n\n` +
//           `Aap neeche diye gaye *Keywords* bhej kar mujhe test kar sakte hain:\n\n` +
//           `1️⃣ *[Services]* - Hum kya kaam karte hain jaan ne ke liye.\n` +
//           `2️⃣ *[Price]* - Packages aur cost dekhne ke liye.\n` +
//           `3️⃣ *[Owner]* - Mere developer (bhai) ki details ke liye.\n` +
//           `4️⃣ *[Clear]* - Inbox saaf karne ka status check karne ke liye.\n\n` +
//           `ℹ️ _Main ek automatic system hoon, reply under 0.5 seconds mein aayega!_`;

//         await sock.sendMessage(senderNumber, { text: welcomeMessage });
//       }

//       // 2. Services Trigger
//       else if (incomingText.toLowerCase() === "services") {
//         console.log("🤖 AI Agent Services reply bhej raha hai...");
//         const servicesText =
//           `🛠️ *Hamari AI Agency ki Top Services:*\n\n` +
//           `• *Gmail Auto-Cleaner:* Hazaron bekar emails under 1 second mein delete karna.\n` +
//           `• *WhatsApp AI Bots:* 24/7 customer support bina kisi insaan ke.\n` +
//           `• *Database Automation:* Users ke tokens ko automatically secure rakhna.`;

//         await sock.sendMessage(senderNumber, { text: servicesText });
//       }

//       // 3. Price Trigger
//       else if (incomingText.toLowerCase() === "price") {
//         console.log("🤖 AI Agent Pricing reply bhej raha hai...");
//         await sock.sendMessage(senderNumber, {
//           text: `💰 *Pricing:* Hamare AI Tools ka setup ekdam *FREE* hai kyunki hum open-source engines (Bun 🚀) ka use karte hain!`,
//         });
//       }

//       // 4. Owner Details Trigger
//       else if (incomingText.toLowerCase() === "owner") {
//         console.log("🤖 AI Agent Owner reply bhej raha hai...");
//         await sock.sendMessage(senderNumber, {
//           text: `👑 *Developer Status:* \n\n Hello boss! Main aapka custom AI Agent hoon. Bun backend se live chal raha hoon! 🔥 \n\n 👑 *Developer Status:* \n\nMujhe mere bhai *Akash Patel* ne *Bun + backend + Agentic AI* use karke ekdam scratch se banaya hai.\n\n- *Akash Patel* bahaut hi hard working student hai,\n\n- *Akash* Bhai ne mujhe abhi *Testing Phase* mein rakha hai,\n\n- Waha bahaut hi bade *project* per kaam kar rahe hai.. \n\n [ Thanks from *Boss Akash Patel 🔥*]\n\n\n\n_🤖 Bhai abhi aap ki baat ek agentic ai tool se ho rahi hai 🤖_ \n\n Boos Abhi busy hai...*`,
//         });
//       }

//       // 5. Clear Trigger
//       else if (incomingText.toLowerCase() === "clear") {
//         console.log("🤖 AI Agent Clear status reply bhej raha hai...");
//         await sock.sendMessage(senderNumber, {
//           text: `🧹 *Gmail Update:* \n Aapka backend Gmail API se connect hai. Bas command milte hi 500 emails ka bundle saaf karne ke liye ready hai!`,
//         });
//       }

//       // 6. Fallback (Agar kuch aur random text daala)
//       else {
//         console.log("🤖 AI Agent Fallback reply bhej raha hai...");
//         await sock.sendMessage(senderNumber, {
//           text: `🤔 Mujhe aapka message *"${incomingText}"* samajh nahi aaya bhai. Saare features dekhne ke liye bas *[Menu]* likh kar bhejo!`,
//         });
//       }
//     }
//   });
// }

// // Function ko chalao testing ke liye
// connectWhatsApp().catch(console.error);

// =====================================================

// import makeWASocket, {
//   useMultiFileAuthState,
//   DisconnectReason,
// } from "@whiskeysockets/baileys";

// // qrcode-terminal does not ship TypeScript declarations
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// // @ts-ignore
// const qrcode = require("qrcode-terminal");

// export async function connectWhatsApp() {
//   // 1. User ke login credentials save karne ke liye folder banega
//   const { state, saveCreds } = await useMultiFileAuthState("whatsapp_session");

//   // 2. WhatsApp connection socket shuru karo
//   const sock = makeWASocket({
//     auth: state,
//     printQRInTerminal: false, // Hum custom tarike se terminal mein print karenge
//   });

//   // 3. Connection status aur QR code monitor karo
//   sock.ev.on("connection.update", (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     // A. Agar naya QR Code aaya hai, toh terminal mein bada dikhao
//     if (qr) {
//       console.clear();
//       console.log("=========================================");
//       console.log("📲 APNE PHONE SE IS QR CODE KO SCAN KARO:");
//       console.log("=========================================");
//       qrcode.generate(qr, { small: true });
//     }

//     // B. Jaise hi user scan kar lega aur connect ho jayega
//     if (connection === "open") {
//       console.clear();
//       console.log(
//         "🎉 Mubarak ho! User ka WhatsApp successfully connect ho gaya hai!",
//       );
//     }

//     // C. Agar connection toot jaye (Internet issue ya Logout karne par)
//     if (connection === "close") {
//       const shouldReconnect =
//         lastDisconnect?.error &&
//         "output" in lastDisconnect.error &&
//         lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;
//       console.log(
//         "Connection close ho gaya. Kya wapas connect karein?",
//         shouldReconnect,
//       );
//       if (shouldReconnect) {
//         connectWhatsApp(); // Wapas try karo
//       }
//     }
//   });

//   // 4. Credentials update hone par unhe automatically save karo
//   sock.ev.on("creds.update", saveCreds);
//   // 5. Jab bhi koi user aapko WhatsApp par naya message bhejega
//   // 5. Jab bhi koi naya message aaye
//   sock.ev.on("messages.upsert", async (m) => {
//     if (m.type !== "notify") return;

//     for (const msg of m.messages) {
//       try {
//         if (!msg.message) continue;
//         if (msg.key.remoteJid === "status@broadcast") continue;
//         if (msg.key.fromMe) continue;

//         const senderNumber = msg.key.remoteJid;
//         if (!senderNumber) continue;

//         const incomingText =
//           msg.message.conversation ||
//           msg.message.extendedTextMessage?.text ||
//           "";

//         console.log(
//           `📩 Naya Message Aaya From [${senderNumber}]: ${incomingText}`,
//         );

//         // condition hatadi - ab HAR message par reply jayega!
//         console.log("🤖 AI Agent reply bhej raha hai...");

//         await sock.sendMessage(senderNumber, {
//           text: "Hello boss! Main aapka custom AI Agent hoon. Bun backend se live chal raha hoon! 🔥 \n\n 👑 *Developer Status:* \n\nMujhe mere bhai *Akash Patel* ne *Bun + backend + Agentic AI* use karke ekdam scratch se banaya hai.\n\n- *Akash Patel* bahaut hi hard working student hai,\n\n- *Akash* Bhai ne mujhe abhi *Testing Phase* mein rakha hai,\n\n- Waha bahaut hi bade *project* per kaam kar rahe hai.. \n\n [ Thanks from *Boss Akash Patel 🔥*]\n\n\n\n_🤖 Bhai abhi aap ki baat ek agentic ai tool se ho rahi hai 🤖_ \n\n Boos Abhi busy hai...",
//         });
//       } catch (error) {
//         console.error("❌ Error:", error);
//       }
//     }
//   });
// }

// // Function ko chalao testing ke liye
// connectWhatsApp();

// =====================================================

import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
// Google Gemini package ko import kiya
import { GoogleGenAI } from "@google/genai";

// qrcode-terminal does not ship TypeScript declarations
// eslint-disable-next-line @typescript-eslint/no-var-requires
// @ts-ignore
const qrcode = require("qrcode-terminal");

// Yahan apni mili hui Gemini API key paste kijiye
const ai = new GoogleGenAI({
  apiKey: "AQ.Ab8RN6LlRuVeTqYi-lPchQK6XBBaddWXD1B2U1mbE7nZWxcIyQ",
});

export async function connectWhatsApp() {
  // 1. User ke login credentials save karne ke liye folder banega
  const { state, saveCreds } = await useMultiFileAuthState("whatsapp_session");

  // 2. WhatsApp connection socket shuru karo
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // Hum custom tarike se terminal mein print karenge
  });

  // 3. Connection status aur QR code monitor karo
  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    // A. Agar naya QR Code aaya hai, toh terminal mein bada dikhao
    if (qr) {
      console.clear();
      console.log("=========================================");
      console.log("📲 APNE PHONE SE IS QR CODE KO SCAN KARO:");
      console.log("=========================================");
      qrcode.generate(qr, { small: true });
    }

    // B. Jaise hi user scan kar lega aur connect ho jayega
    if (connection === "open") {
      console.clear();
      console.log(
        "🎉 Mubarak ho! User ka WhatsApp successfully connect ho gaya hai!",
      );
    }

    // C. Agar connection toot jaye (Internet issue ya Logout karne par)
    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error &&
        "output" in lastDisconnect.error &&
        lastDisconnect.error.output?.statusCode !== DisconnectReason.loggedOut;
      console.log(
        "Connection close ho gaya. Kya wapas connect karein?",
        shouldReconnect,
      );
      if (shouldReconnect) {
        connectWhatsApp(); // Wapas try karo
      }
    }
  });

  // 4. Credentials update hone par unhe automatically save karo
  sock.ev.on("creds.update", saveCreds);

  // 5. Jab bhi koi naya message aaye
  sock.ev.on("messages.upsert", async (m) => {
    if (m.type !== "notify") return;

    for (const msg of m.messages) {
      try {
        if (!msg.message) continue;
        if (msg.key.remoteJid === "status@broadcast") continue;
        if (msg.key.fromMe) continue;

        const senderNumber = msg.key.remoteJid;
        if (!senderNumber) continue;

        const incomingText =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          "";

        console.log(
          `📩 Naya Message Aaya From [${senderNumber}]: ${incomingText}`,
        );

        // Agar message bilkul khali hai toh aage mat badho
        if (!incomingText.trim()) continue;

        console.log("🤖 AI Agent reply bhej raha hai...");

        // Gemini AI se chat ka response mangwaya ek shaandar prompt ke sath
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite",
          contents: incomingText,
          config: {
            systemInstruction: `Aap Akash Patel ke personal Agentic AI assistant hain. 
            Akash Patel ek bohot hi zyada hard-working student hain aur abhi Bun framework, backend aur advanced AI ka use karke ek bohot bade project par kaam kar rahe hain. 
            Kyuki Akash bhai abhi coding aur development mein bohot busy hain, isliye aap unki taraf se WhatsApp par logo ko jawab de rahe hain.

            Baat karne ke rules:
            1. Hamesha natural, dosto wali Hinglish (Hindi + English mix) mein bohot tameez se aur dimaag se jawab dein.
            2. Samne wala kuch bhi puche (jaise "kaun sa note", "kahan ho", "hi", etc.), uske context ko samajh kar hi reply karein. Short aur crisp baat karein.
            3. Agar koi Akash ke baare mein puche, toh batayein ki wo abhi Testing Phase mein hain aur badhiya tools bana rahe hain.
            4. Apne har ek reply ke end mein line breaks dekar hamesha mandatory ye footer text jodein: 
            "\n\n🤖 _NOTE: Bhai abhi aap ki baat ek agentic ai tool se ho rahi hai. Boss abhi busy hain..._ \n[Thanks from *Boss Akash Patel 🔥*]"`,
          },
        });

        // AI ka generated reply uthaya
        const aiReply =
          response.text ||
          "Hello! Boss Akash abhi busy hain, main thodi der mein jawab deta hoon.";

        // WhatsApp par Gemini ka dynamic reply bhej do
        await sock.sendMessage(senderNumber, {
          text: aiReply,
        });
      } catch (error) {
        console.error("❌ Error:", error);
      }
    }
  });
}

// Function ko chalao testing ke liye
connectWhatsApp();
