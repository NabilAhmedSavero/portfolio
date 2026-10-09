import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { HOME_ENTRANCE_INIT, HOME_ENTRANCE_SCRIPT_ID } from "@/components/home-entrance-init";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Nabil — Product & Web Designer",
    template: "%s | Nabil",
  },
  description: "Nabil’s personal portfolio. Product & Web Designer.",
};

export const viewport: Viewport = { viewportFit: "cover" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script id={HOME_ENTRANCE_SCRIPT_ID} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: HOME_ENTRANCE_INIT }} />
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Skip to content
        </a>
        <PageTransition>{children}</PageTransition>
        <Navbar />
      </body>
    </html>
  );
}
