"use client";

import { colorInput } from "@sanity/color-input";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schema-types";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "portfolio",
  title: "Nabil’s Portfolio",
  basePath: "/studio",
  // Local schema extraction works without an account. The route never mounts
  // Studio until real environment identifiers are supplied.
  projectId: projectId || "unconfigured",
  dataset: dataset || "production",
  plugins: [structureTool({ structure }), colorInput()],
  schema: { types: schemaTypes },
  document: { singletons: ["siteContent"] },
  // Default Sanity authentication and project permissions are intentionally used.
});
