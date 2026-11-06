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
        <div className="flex flex-col items-start w-full">
          <h2 id={headingId} className="m-0 font-sans text-[15px] leading-[20px] font-[450] text-[#999999]">
            {title}
          </h2>
          <div
            aria-hidden="true"
            className="w-full border-b border-[#e5e5e5] my-[14px] pointer-events-none"
          />
        </div>
      )}
      {children}
    </section>
  );
}
