## Tool Dispatcer

**WithOut Dispatcer**

LLL JSON ----> Direct Execution
`Problem`:

- Ager LLM ne galat JSON format send kar diya to , tool nahi milgea and isse pura pplication carsh ho jayega to issi problem ko dispatcer solve karta hai

- Tool diptacher jo hai uska kaam hai tool ko kise execute karwaye

**With Dispatcer**
LLM JSON --> Dispatcer( validate, context ,permission check, and etc) --> execution
