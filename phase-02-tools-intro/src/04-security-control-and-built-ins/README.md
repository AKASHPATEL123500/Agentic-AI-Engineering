# 🛡️ Module 03: Security, Control & Built-ins

Bhai, is module ka simple matlab hai: Agent ko **Aukaat** mein rakhna aur use **Duniya** se jodna!

---

## 🏎️ Point-to-Point Cheat Sheet (No Overload)

### 🫱‍🫲 17. Permissions & Human Approval

- **Main Point:** **"Poch kar karo!"**
- **Asli Kaam:** Agar LLM koi dangerous kaam karega (jaise paise katna ya file delete karna), to system ruk jayega. Terminal par `[y/n]` ka prompt aayega. Jab tak tum `y` nahi dabaoge, tool execute nahi hoga.

### 🚷 18. Security & Sandboxing

- **Main Point:** **"Jail ke andar rakho!"**
- **Asli Kaam:** LLM ke code ko ek alag surakshit ghere (Sandbox/Worker) mein chalana taaki agar code phate ya ganda ho, to tumhara asli computer hardware safe rahe.

### 📦 19. Built-in Tools

- **Main Point:** **"In-the-box toolkit!"**
- **Asli Kaam:** Kuch basic aur important tools jo hamare system ke andar pehle se bane-banaye (ready-made) aate hain—jaise math calculations ya safe text formatting.

### 🌐 20. External Tools

- **Main Point:** **"Internet se dosti!"**
- **Asli Kaam:** Hamare dispatcher ko teesri duniya ki APIs (jaise GitHub, Google Search, Slack) se wrap karke connect karna.

### 🔌 21. Plugin Architecture

- **Main Point:** **"Plug and Play!"**
- **Asli Kaam:** Ek aisa system banana jahan koi bhi naya developer bina hamare main engine ke code ko chede, apna poora ka poora tools ka set (Plugin) system mein attach kar sake.

---

## 🔄 Live Flow Map

LLM Payload ➔ Sandbox Check ➔ Dangerous? ➔ Prompt [y/n] ➔ Load (Built-in/External/Plugin) ➔ Run!
