const user = { name: "Ankit", role: "admin" };

user.name;
user.role;

// Ab TypeScript ko kaise batayein
// ki is object ke andar ki saari Keys hamesha string
// hongi aur unke samne wali Values bhi hamesha string hi hongi
// ? Uske liye hum use karte hain:
// ? Record<Key_Ka_Type, Value_Ka_Type>.

// Ek line mein matlab: Yeh sirf ek Dictionary(शब्दकोश)
// ya Map batane ka TypeScript ka tarika hai,
// jisme hum pehle se hi fix kar dete hain ki Key kya hogi aur Value kya hogi.
// Iska matlab: Ek aisa object jiski key bhi string ho aur value bhi string ho
const newUser: Record<string, string> = {
  name: "Akas",
  role: "admin",
};

newUser["name"] = "shiva";
