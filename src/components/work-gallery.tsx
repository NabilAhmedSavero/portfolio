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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
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
                className="group/image block cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135E4F] rounded-xl md:rounded-2xl"
                aria-label={`View ${item.name}`}
              >
                {/* Image Container: Clean rounded corners, hidden overflow */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl md:rounded-2xl bg-neutral-100 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-black/[0.04] transition-all duration-300 group-hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 580px"
                    priority={index < 2}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* Desktop Hover State: slight dimming overlay + centered blur badge */}
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-xs sm:text-sm font-medium text-neutral-900 shadow-lg transform transition-all duration-300 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100">
                      <span>
                        {item.externalUrl ? "View Project" : "Click to open"}
                      </span>
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M4 12L12 4M12 4H6M12 4V10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Tag>

              {/* Caption: Project title (bold) and short subtitle (muted) directly below */}
              <div className="mt-4 flex flex-col gap-1">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight">
                  {item.name}
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-normal leading-relaxed">
                  {item.subtitle}
                </p>
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
