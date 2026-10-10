"use client";

import Image from "next/image";
import { useEffect, useState, type MouseEvent } from "react";
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

  // Close lightbox on Escape key
  useEffect(() => {
    if (!lightboxItem) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxItem(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxItem]);

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
                    <div className="flex items-center gap-2 text-white text-xl sm:text-2xl md:text-[24px] font-medium tracking-tight transform transition-transform duration-300 scale-95 group-hover:scale-100">
                      <span>
                        {item.externalUrl ? "Case study" : "Click to open"}
                      </span>
                      <span
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 select-none font-normal"
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </div>
              </Tag>

              {/* Caption: Title / Subtitle horizontal alignment format */}
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
                      className="text-neutral-400 select-none text-[14px] font-normal"
                      aria-hidden="true"
                    >
                      /
                    </span>
                    <p
                      className="text-[14px] font-[400] leading-normal"
                      style={{
                        fontSize: "14px",
                        fontWeight: 400,
                        color: "hsl(0, 0%, 25%)",
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

      {/* Lightbox Modal for projects without external links */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6 md:p-10 cursor-pointer animate-in fade-in duration-200"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Full preview of ${lightboxItem.name}`}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] overflow-hidden rounded-xl md:rounded-2xl bg-neutral-900 shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full max-h-[80vh]">
              <Image
                src={lightboxItem.image.src}
                alt={lightboxItem.image.alt}
                fill
                sizes="(max-width: 1200px) 95vw, 1200px"
                className="object-contain"
              />
            </div>
            <div className="p-4 sm:p-5 bg-neutral-950/90 flex items-center justify-between border-t border-white/10">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  {lightboxItem.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400">
                  {lightboxItem.subtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-xs text-white font-medium transition-colors"
                aria-label="Close preview"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
