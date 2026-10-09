import type { ReactNode } from "react";

// Works owns the viewport; Home keeps the narrow shared container.
export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="work-canvas-layout" tabIndex={-1}>{children}</main>
  );
}
