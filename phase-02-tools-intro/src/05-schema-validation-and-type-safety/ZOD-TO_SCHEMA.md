### Zod ke ander built-in hai

`z.toJSONSchema`

- iska use kar ke hum kisi bhi zod object ko json schema mein convert kar sakte hai
- example: `z.toJSONSchema(schemaname)`

---

**My example :**
`console.log(JSON.stringify(z.toJSONSchema(bulkUserBaseSchema), null, 2));`

```bash
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "batchName": {
      "type": "string",
      "minLength": 3
    },
    "users": {
      "minItems": 1,
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "email": {
            "type": "string",
            "format": "lowercase",
            "allOf": [
              {
                "pattern": "^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$"
              },
              {
                "pattern": "^[^A-Z]*$"
              }
            ]
          },
          "role": {
            "default": "viewer",
            "type": "string",
            "enum": [
              "admin",
              "developer",
              "viewer"
            ]
          },
          "tags": {
            "minItems": 1,
            "type": "array",
            "items": {
              "type": "string"
            }
          }
        },
        "required": [
          "email",
          "role",
          "tags"
        ],
        "additionalProperties": false
      }
    },
    "notifyUsers": {
      "default": true,
      "type": "boolean"
    }
  },
  "required": [
    "batchName",
    "users",
    "notifyUsers"
  ],
  "additionalProperties": false
}
```

---

**This is tha correct JSON for LLM**
