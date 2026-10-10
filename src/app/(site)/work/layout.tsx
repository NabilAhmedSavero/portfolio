import type { ReactNode } from "react";

export default function WorkLayout({ children }: { children: ReactNode }) {
  return (
    <main
      id="main-content"
      className="work-gallery-layout"
      tabIndex={-1}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        overflowX: "hidden",
        height: "100dvh",
        width: "100vw",
        maxWidth: "100%",
      }}
    >
      {children}
    </main>
  );
}
