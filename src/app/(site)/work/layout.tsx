import type { ReactNode } from "react";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="work-gallery-layout" tabIndex={-1}>{children}</main>
  );
}
