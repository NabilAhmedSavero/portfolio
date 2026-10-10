"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type MouseEvent } from "react";
import type { WorkSlide } from "@/data/projects";

export type WorkGalleryItem = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: {
    src: string;
    alt: string;
    aspectRatio?: number;
  };
};

export function WorkGallery({
  items,
}: {
  items: readonly (WorkSlide | WorkGalleryItem)[];
}) {
  const [lightboxItem, setLightboxItem] = useState<
    WorkSlide | WorkGalleryItem | null
  >(null);

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!lightboxItem) return;
      const currentIndex = items.findIndex((i) => i.id === lightboxItem.id);
      const prevIndex = (currentIndex - 1 + items.length) % items.length;
      setLightboxItem(items[prevIndex]);
    },
    [lightboxItem, items],
  );

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (!lightboxItem) return;
      const currentIndex = items.findIndex((i) => i.id === lightboxItem.id);
      const nextIndex = (currentIndex + 1) % items.length;
      setLightboxItem(items[nextIndex]);
    },
    [lightboxItem, items],
  );

  // Close lightbox on Escape, navigate with ArrowLeft/ArrowRight
  useEffect(() => {
    if (!lightboxItem) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxItem(null);
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxItem, handlePrev, handleNext]);

  const handleCardClick = (
    e: MouseEvent<HTMLElement>,
    item: WorkSlide | WorkGalleryItem,
  ) => {
    if (!item.externalUrl) {
      e.preventDefault();
      setLightboxItem(item);
    }
  };

  return (
    <section aria-label="Work Projects">
      {/* Responsive CSS Grid: 1 column on mobile, 2 columns on desktop (md+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => {
          const Tag = item.externalUrl ? "a" : "div";
          const linkProps = item.externalUrl
            ? {
                href: item.externalUrl,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {
                role: "button",
                tabIndex: 0,
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxItem(item);
                  }
                },
              };

          return (
            <article key={item.id} className="group flex flex-col">
              <Tag
                {...linkProps}
                onClick={(e) => handleCardClick(e as unknown as MouseEvent<HTMLElement>, item)}
                className="group/image block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135E4F] rounded-[8px]"
                aria-label={`View ${item.name}`}
              >
                {/* Image Container: Clean 8px rounded corners, hidden overflow */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[8px] bg-neutral-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-black/[0.04] transition-all duration-300 group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
                    priority={index < 2}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Desktop Hover State: dimmed overlay + pure white floating text (Skale style) */}
                  <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <div className="flex items-center gap-[12px] text-white text-xl sm:text-2xl md:text-[24px] font-medium tracking-tight transform transition-transform duration-300 scale-95 group-hover:scale-100">
                      <span>
                        {item.externalUrl ? "Case study" : "Open"}
                      </span>
                      <span className="inline-flex items-center self-center translate-y-[3px]">
                        <span
                          className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 select-none font-normal text-[24px] sm:text-[28px] md:text-[28px] leading-none"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Tag>

              {/* Caption: Title / Subtitle unified 15px font size */}
              <div className="mt-6 flex items-baseline flex-wrap gap-x-1.5 gap-y-0.5">
                <h2
                  className="text-[15px] font-[500] text-neutral-900 leading-snug tracking-normal"
                  style={{ fontSize: "15px", fontWeight: 500 }}
                >
                  {item.name}
                </h2>
                {item.subtitle && (
                  <>
                    <span
                      className="select-none text-[15px] font-normal"
                      style={{ fontSize: "15px", fontWeight: 400, color: "#737373" }}
                      aria-hidden="true"
                    >
                      /
                    </span>
                    <p
                      className="text-[15px] font-[400] leading-normal"
                      style={{
                        fontSize: "15px",
                        fontWeight: 400,
                        color: "#737373",
                      }}
                    >
                      {item.subtitle}
                    </p>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox Modal: Maximized open state */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between py-[3vh] px-4 bg-black/90 backdrop-blur-md cursor-pointer animate-in fade-in duration-200 select-none"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Full preview of ${lightboxItem.name}`}
        >
          {/* Top: Title only on highest point of viewport with reasonable top padding */}
          <header className="text-center z-20 shrink-0 pointer-events-none select-none">
            <h2 className="text-white text-sm sm:text-base md:text-lg font-medium tracking-tight">
              {lightboxItem.name}
            </h2>
          </header>

          {/* Center: Maximized Image leaving ONLY ~5% top/bottom margin, clicks outside image close overlay */}
          <div className="relative z-10 flex items-center justify-center w-full flex-1 min-h-0 py-2 sm:py-3 pointer-events-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxItem.image.src}
              alt={lightboxItem.image.alt}
              className="h-full w-auto max-h-[85vh] sm:max-h-[88vh] max-w-[95vw] object-contain rounded-[8px] pointer-events-auto shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Bottom: Round Smintfy-style navigation chevrons (max height 24px, 8px gap) centered horizontally */}
          <nav
            className="flex items-center justify-center gap-2 z-20 shrink-0"
            aria-label="Modal image navigation"
          >
            <button
              type="button"
              onClick={handlePrev}
              className="w-[24px] h-[24px] max-h-[24px] max-w-[24px] rounded-full bg-[#505050]/90 hover:bg-[#656565] active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                className="w-[14px] h-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-[24px] h-[24px] max-h-[24px] max-w-[24px] rounded-full bg-[#505050]/90 hover:bg-[#656565] active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-label="Next image"
            >
              <svg
                className="w-[14px] h-[14px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </section>
  );
}
