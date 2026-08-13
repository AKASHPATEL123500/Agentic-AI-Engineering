```ts
1. Pichle Phase (Phase 02) mein hamare Guard ne LLM ke tede-mede data ko ekdam chamka kar ek clean
ToolCallPayload bana diya. Ab hamare paas ek saaf-suthra tool ka naam hai (e.g., "get_weather").
2.
Ab is Phase 03 ka sirf ek hi maqsad hai:
"Pata lagao ki jo tool naam LLM maang raha hai,"
"kya wo sach mein hamare system ke andar (Registry mein) maujood hai? "
"Agar hai to use nikaalo, aur agar nahi hai to bina crash huye handle karo."

```

**Main Point of this phase**

> Ab is Phase 03 ka sirf ek hi maqsad hai: "Pata lagao ki jo tool naam LLM maang raha hai, kya wo sach mein hamare system ke andar (Registry mein) maujood hai? Agar hai to use nikaalo, aur agar nahi hai to bina crash huye handle karo."

> isle liye hum ek `function` banayege and ussme
>
> 1. and parsms mein jo hai waha toolName lega and ToolRegistry lega
> 2. and ToolName jo hamara phase 02 ne diya hai normalize kar ke
> 3. ToolRegistry jo hamari regsitry hai uska instence denge
> 4. jise hi hum ToolRegsity hamare pas ayige ussme hamare pass
> 5. ye sare method mill jayege has,get , regsitrer,etc
> 6. to sabse opahle hum iss toolname se has ki madad se regitry mein check karegeneg ki yaha tool hai ki nahi
> 7. and agr true hai to hum get kar leneg tool ko
> 8. check kar leneg ki tool hai ki nahi tool ke ander ececute fun hai ki nahi and execute ka type fun hai ki nahi
> 9. then hum retrun kar denge tool ko
