import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      perspective: "published",
      useCdn: false,
      stega: false,
      token: process.env.SANITY_API_READ_TOKEN || undefined,
      timeout: 10_000,
      maxRetries: 1,
    })
  : null;

// Next.js owns the only response cache; this interval also covers shared footer data.
export const CONTENT_REVALIDATE_SECONDS = 60;

export async function fetchPublished<T>(query: string): Promise<T | null> {
  if (!client) return null;

  try {
    return await client.fetch<T>(query, {}, {
      perspective: "published",
      next: { revalidate: CONTENT_REVALIDATE_SECONDS },
    });
  } catch {
    // Keep secrets and request details out of logs while making a failed connection visible.
    console.warn("[Sanity] Published content request failed; using local fallback content.");
    return null;
  }
}
