// Shared public configuration only. Server credentials belong in lib/client.ts.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "";
export const apiVersion = "2025-02-19";
export const isSanityConfigured = Boolean(projectId && dataset);
