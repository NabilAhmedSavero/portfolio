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
          <h2 id={headingId} className="font-sans text-[15px] leading-[20px] font-normal text-[#999999]">
            {title}
          </h2>
          <div
            aria-hidden="true"
            className="w-full h-0 border-t border-[#e5e5e5] my-[14px] pointer-events-none"
            style={{ transform: "translateZ(0)" }}
          />
        </div>
      )}
      {children}
    </section>
  );
}
