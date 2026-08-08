## 02. Node.js Path & FS Primitives.

Jab hum disk par files dhoondhenge, toh Node.js ke yeh 3 functions hamare sabse bade hathiyar (tools) honge. Inka exact kaam bina kisi lallu-panju theory ke samajhiye:

**1. path.resolve(...paths) — Address Banane Wala**

- Yeh aapke relative path (jaise ./src/tools) ko computer ka asli, poora address (Absolute Path) bana deta hai (jaise D:\project\src\tools).

- Kyunki Node.js ko agar poora address nahi doge, toh wo confuse ho jayega ki file kahan se dhoondhni hai.

**2. fs.promises.readdir(path, options) — Folder ka Parda Kholne Wala**

- Aap isko ek folder ka path dete hain, aur yeh us folder ke andar jitni bhi files aur sub-folders hote hain, un sabke naamon ki ek list (string[]) aapko nikaal kar de deta hai.
- Isi se toh Discovery engine ko pata chalega ki folder ke andar kaun-kaun si files padi hain.

**3. path.extname(path) — Surname (Extension) Check Karne Wala**

- Yeh kisi bhi file ka extension (jaise .ts, .js, .json) nikaal kar deta hai.
- Hamein sirf TypeScript (.ts) ya hamare naming convention waali files chahiye. Agar koi file .txt ya .png hai, toh hum use yahin se reject kar denge.
