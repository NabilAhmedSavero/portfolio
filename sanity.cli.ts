import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  typegen: {
    path: "./src/sanity/lib/queries.ts",
    schema: "./sanity-schema.json",
    generates: "./src/sanity/types.ts",
  },
});
