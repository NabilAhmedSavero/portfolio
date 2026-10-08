import type { ReactNode } from "react";

// Separate root layout isolates Studio from the portfolio's CSS and page chrome.
export default function StudioLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
