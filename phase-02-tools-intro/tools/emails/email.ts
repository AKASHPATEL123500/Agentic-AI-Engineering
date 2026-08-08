import { google } from "googleapis";

// 1. Google cloud concole se ye crendial meilgea
const CLIENT_ID = "************************";
const CLIENT_SECRET = "*******************";
const REDIRECT_URL = "https://google.com";
const REFRESH_TOKEN = "**********************************";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL,
);

oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

// Gemail api instence tayar hai abb
const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

// 3. Main function jo naye sare mail ko read karega
export async function readMyEmails() {
  try {
    // pahle unread emails ki list nikalo(max 5 nikal rahe hai)
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread category:primary",
      maxResults: 5,
    });
    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      console.log("Ek bhi email nahi mila bhai");
      return [];
    }

    const emailList = [];
    // har ek message ki details nikalo loop chala kar
    for (const msg of messages) {
      const emailDetials = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
      });

      const headers = emailDetials.data.payload?.headers || [];

      // email ks subjet and sender ka naam nikalne ke liye
      const subject =
        headers.find((h) => h.name?.toLowerCase() === "subject")?.value ||
        "No Subject";
      const from =
        headers.find((h) => h.name?.toLowerCase() === "from")?.value ||
        "Unknwon";
      const snippt = emailDetials.data.snippet || ""; // Email ki string line summary

      emailList.push({
        id: msg.id,
        from: from,
        subject: subject,
        preview: snippt,
      });
    }

    console.log("Mili hui emails : ", emailList);
    return emailList;
  } catch (error) {
    console.log("Email read karne me error aya hi :", error);
    throw error;
  }
}

// readMyEmails();

export async function directCleanInbox() {
  try {
    // 1. Sirf unread ya faltu emails ki ID ki list nikalo (koi data read nahi hoga)
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread category:primary", // 👈 filter jo aapko lagana ho
      maxResults: 500, // 👈 ek baar mein jitne delete karne ho
    });

    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      console.log("Inbox pehle se saaf hai bhai!");
      return;
    }

    console.log(
      `🧹 Total ${messages.length} bekar emails mile. Safai shuru...`,
    );

    // 2. Bina read kiye seedhe loop chala kar Trash mein daalo
    for (const msg of messages) {
      if (!msg.id) {
        continue;
      }

      await gmail.users.messages.trash({
        userId: "me",
        id: msg.id,
      });
      console.log(`🗑️ Email ID: ${msg.id} ko trash mein daal diya.`);
    }

    console.log("🎉 Safai poori ho gayi!");
  } catch (error) {
    console.log("Safai karne mein error aaya:", error);
  }
}

// directCleanInbox();

export async function fastAgentCleanInbox() {
  try {
    console.time("⚡ Agent Execution Time"); // Speed check karne ke liye

    // 1. Sirf aur sirf IDs mangao (Super Fast Network Response)
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread category:primary",
      maxResults: 500, // Ek baar mein seedhe 500 uthao
      fields: "messages/id", // 👈 Google ko bolo faltu data na bhejey, sirf ID de
    });

    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      console.log("Inbox clean hai.");
      return { success: true, deletedCount: 0 };
    }

    const emailIds = messages.map((msg) => msg.id).filter(Boolean) as string[];

    if (emailIds.length === 0) {
      console.log("No valid message IDs to modify.");
      return { success: true, deletedCount: 0 };
    }

    // 2. Bina loop ke, Single HTTP Request se 500 emails ek jhatke mein Trash karo
    await gmail.users.messages.batchModify({
      userId: "me",
      requestBody: {
        ids: emailIds,
        addLabelIds: ["TRASH"],
        removeLabelIds: ["INBOX"],
      },
    });

    console.timeEnd("⚡ Agent Execution Time"); // Yeh terminal mein batayega kitna fast hua
    console.log(`🎉 Successfully cleaned ${emailIds.length} emails in one go!`);

    return { success: true, deletedCount: emailIds.length };
  } catch (error) {
    console.error("Agent bulk cleaning failed:", error);
    throw error;
  }
}

// fastAgentCleanInbox();

export async function cleanAllMailMasterList() {
  try {
    console.time("⚡ All Mail Clean Time");

    // 1. All Mail se bekar emails ki IDs nikalo (Trash aur Spam ko chhodkar)
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      // 👇 Yeh query poore All Mail se Promotions, Social aur Updates wale faltu emails uthayegi
      q: "-in:trash -in:spam (category:promotions OR category:social OR category:updates)",
      maxResults: 500,
      fields: "messages/id",
    });

    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      console.log(
        "All Mail mein ab koi faltu category ka email nahi bacha bhai!",
      );
      return { success: true, deletedCount: 0 };
    }

    const emailIds = messages
      .map((msg) => msg.id)
      .filter((id): id is string => typeof id === "string");
    console.log(
      `🧹 All Mail master list se ${emailIds.length} faltu emails mile. Permanently delete kar raha hoon...`,
    );

    // 2. batchDelete use karo - yeh Trash mein nahi bhejega, seedhe hamesha ke liye delete kar dega
    await gmail.users.messages.batchDelete({
      userId: "me",
      requestBody: {
        ids: emailIds,
      },
    });

    console.timeEnd("⚡ All Mail Clean Time");
    console.log("🎉 All Mail se ek hi baar mein sab jadd se saaf ho gya!");

    return { success: true, deletedCount: emailIds.length };
  } catch (error) {
    console.error("All Mail cleaning failed:", error);
    throw error;
  }
}
cleanAllMailMasterList();
