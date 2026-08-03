// Generic kya hota hai?
// Generic ka matlab hai:
// Ek aisa template jo baad me decide karega ki uske andar ka type kya hoga.

// Jise Math mein X+% hota hai
// X ki value nahi pata baad meilga

// Wise hi typescript mein T hota hai
// T ka mtlb hai "Abhi type nahi pata. Baad me bata dena."

// Example:

interface Box<T> {
  value: T;
}

// Yahan T ek placeholder hai.
// Ab isse alag-alag boxes bana sakte hain.

// Number Box

const box: Box<number> = {
  value: 100,
};

// Yahan T = number

// To interface ban gaya:
// interface Box {
//     value: number;
// }

// String Box
const stBox: Box<string> = {
  value: "Akash",
};

// Yaha T=string hai
// To interface nam jayega
// interface Box{
//    value:string
// }

// Boolean
const bol: Box<boolean> = {
  value: true,
};
