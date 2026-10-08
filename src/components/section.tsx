import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, children, className }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className={`section-stack${className ? ` ${className}` : ""}`}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  );
}
