import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title?: string;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
};

export function Section({ id, title, ariaLabel, children, className }: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={title ? headingId : undefined}
      aria-label={!title ? (ariaLabel ?? id) : undefined}
      className={`section-stack${className ? ` ${className}` : ""}`}
    >
      {title && (
        <div className="flex flex-col items-start">
          <h2 id={headingId}>{title}</h2>
          <hr aria-hidden="true" className="w-[36px] h-[1px] bg-[#e5e5e5] border-0 mt-[12px] mb-[16px]" />
        </div>
      )}
      {children}
    </section>
  );
}
