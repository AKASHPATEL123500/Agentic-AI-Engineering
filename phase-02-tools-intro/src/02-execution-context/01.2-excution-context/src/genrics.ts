// Without genrics

// function identity(value: any) {
//   return value;
// }

// const a = identity(1);  // Typescript ko pata nahi hai ki yaha kya hau number hai ki nahi
// const b = identity("hello") // ts ko nahi pata ki yaha string kyu ki waha "any" use hua hai
// console.log(a);

// With genrics

function indentity<T>(value: T): T {
  return value;
}

// TypeScript samajhta hai: T = number, toh 'a' ka type = number
const c = indentity(1); // Typescript samjh gaya yaha numbre hai aur ussi type ka ban gaya
const string = indentity("hello").toUpperCase(); // T = string 'b' ka type = string

// Explation
// function indentitys<T = number ban jayega>(value: T = same wise hi ): T= yaha number retrun karega{
//     return value
// }
