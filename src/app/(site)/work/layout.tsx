import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SiteContainer } from "@/components/site-container";

// Keep the existing Work foundation separate from the now-designed Home page.
export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <SiteContainer>
      <header><Navbar /></header>
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </SiteContainer>
  );
}
