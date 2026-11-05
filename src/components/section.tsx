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
            className="w-full h-[2px] mt-[14px] mb-[12px] flex items-start pointer-events-none"
          >
            <div className="w-full h-[1.5px] bg-[#e5e5e5]" />
          </div>
        </div>
      )}
      {children}
    </section>
  );
}
