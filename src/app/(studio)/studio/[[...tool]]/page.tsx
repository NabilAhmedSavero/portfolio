import { NextStudio } from "next-sanity/studio";
import Link from "next/link";
import config from "../../../../../sanity.config";
import { isSanityConfigured } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main>
        <h1>Sanity Studio is not connected</h1>
        <p>Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local, then restart the app.</p>
        <p>Connection instructions are in docs/sanity-setup.md.</p>
        <Link href="/">Return to portfolio</Link>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
