import { SarvamAIClient } from "sarvamai";
import "dotenv/config";
import * as fs from "fs";

const client = new SarvamAIClient({
  apiSubscriptionKey: "sk_4tj2bdr5_Ko1mtRp2XXZrDgA0I0OLLNr0",
});

const response = await client.textToSpeech.convert({
  model: "bulbul:v3",
  // यहाँ ऊपर दी गई दोनों स्क्रिप्ट में से कोई भी एक पेस्ट करें
  text: "अरे वाह! आखिरकार हम बात कर ही रहे हैं... मुझे बहुत खुशी हुई कि आपने सिमरन यानी मेरी आवाज़ को चुना। वैसे... सच बताऊँ तो आज की इस भागदौड़ भरी ज़िंदगी में... जब कोई इतनी अच्छी हिंदी में बात करता है ना, तो सुनकर दिल खुश हो जाता है। मुझे पता है कि आप कोई बहुत ही कमाल का प्रोजेक्ट बना रहे हैं। तो बताइए... आज आपका दिन कैसा रहा? और हाँ, इस डिजिटल दुनिया के सफर में... मैं आपकी क्या मदद कर सकती हूँ? बेझिझक बताइए, हम मिलकर इसे बहुत मजेदार बनाएंगे!",
  target_language_code: "hi-IN",
  speaker: "simran",
  pace: 0.95, // 👈 इससे आवाज़ में बहुत ही नेचुरल ठहराव (Fluency) आएगा
});

if (response.audios && response.audios.length > 0) {
  const base64Audio = response.audios[0];
  const audioBuffer = Buffer.from(base64Audio, "base64");

  fs.writeFileSync("simran_chat.wav", audioBuffer);
  console.log("✅ Simran's conversational audio saved as simran_chat.wav");
} else {
  console.error("❌ Failed to generate audio.");
}
