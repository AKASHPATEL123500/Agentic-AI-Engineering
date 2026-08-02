import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

console.log(JSON.stringify(z.toJSONSchema(schema), null, 2));
