/*
Typescript:

TypeScript mein iska kya kaam hai?Code mein hum <T> likhte hain.
 Yeh T aur kuch nahi, bas ek Type Variable hai (jaise math mein x hota hai).
*/

// -----------------------------------------------------------------------------------------
// WithOut Genric

// Yeh function sirf Number le sakta hai aur Number de sakta hai
function numberBox(_num: number) {
	return {};
}
// Ye function sirf String le sakta hai aur string de sakta hai bass
function stringBox(_T: string) {
	return _T;
}

stringBox("heloo");
numberBox(20);
// -----------------------------------------------------------------------------------------

// With Genrics

// Humne ek hi function banaya aur usme <T> laga diya:
function myData<T>(item: T) {
	return item;
}

myData(10);
myData("hello");
myData(false);

// Ab aap isko jaise chahe use karo:
// meraDabba(10) → TS samajh jayega ki T yahan ek Number hai.
// meraDabba("Rahul") → TS samajh jayega ki T yahan ek String hai

import { z } from "zod";

// Yeh humara generic function hai. <T> ka matlab yeh kisi bhi type ke liye chalega.
function checkMyData<T>(schema: z.ZodType<T>, data: unknown): T {
	return schema.parse(data); // Yeh data check karega aur sahi type return karega
}

// --- USE KAISE KAREIN? ---

// 1. Ek rule banaya User ke liye
const UserRule = z.object({
	name: z.string(),
});

// 2. Function ko use kiya
// TS automatic samajh jayega ki output 'UserRule' jaisa hi hoga
const safeUser = checkMyData(UserRule, { name: "Rahul" });

console.log(safeUser.name); // Yeh bilkul safe chalega!

/*
Aapne bilkul 100% sahi pakda hai! 🎯Aapne poore concept ko bilkul sahi tarike se break kiya hai.
 Aapne jo samjha hai, 
 woh bilkul perfect hai. 
 Ek baar aapke points ko aur pakka kar dete hain:
 <T>: Jo data pass karenge, wahi type ban jayega. (Bilkul Sahi!)
 schema block: Jab aapne UserSchema pass kiya, to uske andar { username: string } ka rule chala gaya. (Bilkul Sahi!)
 rawData block: Iske andar real value { username: "amit123" } gayi. (Bilkul Sahi!)
 schema.parse(rawData): Isne rawData ko uthaya, check kiya ki object hai ya nahi, u
 sername string hai ya nahi, aur sab sahi milne par data return kar diya. (Bilkul Sahi!)
 Aapne TypeScript aur Zod ke sabse mushkil concept ko asani se samajh liya hai.
Ab aap is reusable function ko apne kisi bhi project mein use kar sakte hain—chahe aapko User validate karna ho,
Product validate karna ho, ya koi API ka data!

*/
