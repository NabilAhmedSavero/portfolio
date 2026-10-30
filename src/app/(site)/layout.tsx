import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Instrument_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { PageTransition } from "@/components/page-transition";
import { HOME_ENTRANCE_INIT, HOME_ENTRANCE_SCRIPT_ID } from "@/components/home-entrance-init";
import "../globals.css";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

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
    <html lang="en" className={`${instrumentSans.variable} antialiased m-0 p-0`}>
      <body className={`${instrumentSans.className} font-sans antialiased m-0 p-0`}>
        <script id={HOME_ENTRANCE_SCRIPT_ID} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: HOME_ENTRANCE_INIT }} />
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only">
          Skip to content
        </a>
        <PageTransition>{children}</PageTransition>
        {/* Top Progressive Viewport Blur */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 top-0 h-[48px] z-30 backdrop-blur-[2.5px] bg-gradient-to-b from-[#fafafa]/35 to-transparent"
          style={{
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 100%)",
          }}
        />
        {/* Bottom Progressive Viewport Blur */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-x-0 bottom-0 h-[56px] z-30 backdrop-blur-[2.5px] bg-gradient-to-t from-[#fafafa]/35 to-transparent"
          style={{
            WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 100%)",
            maskImage: "linear-gradient(to top, black 0%, transparent 100%)",
          }}
        />
        <Navbar />
      </body>
    </html>
  );
}
