const rawModule = {
  name: "wather-tool",
  version: "1.0.0",
  default: {
    name: "akash",
    dates: "1828wi",
    execute: () => {},
  },
};

console.log(
  rawModule.default.name && typeof rawModule.default.name === "string",
);
console.log(typeof rawModule.default.execute === "function");
