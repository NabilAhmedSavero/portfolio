"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import { createWorkSlides, type Project, type WorkSlide } from "@/data/projects";
import { urlFor, imageUrl } from "@/sanity/lib/images";

import type { ContentImage } from "@/sanity/types";
import type { SanityImageSource } from "@sanity/image-url";

export type SanityProject = {
  _id: string;
  name?: string;
  title?: string;
  subtitle?: string;
  coverImage?: ContentImage | SanityImageSource;
  mainImage?: ContentImage | SanityImageSource;
  additionalImages?: Array<
    ContentImage & {
      _key?: string;
      aspectRatio?: number;
    }
  >;
  externalUrl?: string;
  displayOrder?: number;
};

export type WorkGalleryItem = {
  id: string;
  name: string;
  subtitle: string;
  externalUrl?: string;
  image: {
    src: string;
    fullSrc?: string;
    alt: string;
    aspectRatio?: number;
  };
};

export type WorkGalleryProps = {
  projects?: readonly SanityProject[];
  items?: readonly (WorkSlide | WorkGalleryItem)[];
  fallbackProjects?: readonly Project[];
};

function resolveSanityImageUrl(
  source: SanityImageSource | ContentImage | { src?: string; alt?: string } | string | null | undefined,
  width?: number,
): string {
  if (!source) return "/images/work-placeholder.svg";
  if (typeof source === "string") return source;
  if (typeof source === "object" && "src" in source && typeof source.src === "string") {
    return source.src;
  }

  try {
    const builder = urlFor(source as SanityImageSource);
    if (builder) {
      if (width) {
        return builder.width(width).fit("max").quality(100).auto("format").url();
      }
      return builder.auto("format").quality(100).url();
    }
  } catch {
    // fallback below
  }

  return imageUrl(source as SanityImageSource) || "/images/work-placeholder.svg";
}

function resolveSanityAspectRatio(
  source: ContentImage | SanityImageSource | { aspectRatio?: number } | null | undefined,
): number {
  if (source && typeof source === "object") {
    if ("aspectRatio" in source && typeof source.aspectRatio === "number") {
      return source.aspectRatio;
    }
    const asset = "asset" in source ? source.asset : undefined;
    const ref = asset && typeof asset === "object" && "_ref" in asset ? asset._ref : undefined;
    if (typeof ref === "string") {
      const match = ref.match(/^image-[^-]+-(\d+)x(\d+)-[a-z0-9]+$/i);
      if (match) {
        const w = Number(match[1]);
        const h = Number(match[2]);
        if (w > 0 && h > 0) return w / h;
      }
    }
  }
  return 1440 / 1024;
}

function getAltText(source: unknown, fallback: string): string {
  if (source && typeof source === "object" && "alt" in source && typeof source.alt === "string") {
    return source.alt;
  }
  return fallback;
}

function createItemsFromSanity(projects: readonly SanityProject[]): WorkGalleryItem[] {
  return projects.flatMap((project) => {
    const name = project.name || project.title || "Untitled";
    const subtitle = project.subtitle || "";
    const coverSource = project.coverImage || project.mainImage;
    const coverUrl = resolveSanityImageUrl(coverSource, 2048);
    const coverFullUrl = resolveSanityImageUrl(coverSource);
    const coverAlt = getAltText(coverSource, name);
    const coverRatio = resolveSanityAspectRatio(coverSource);

    const coverItem: WorkGalleryItem = {
      id: `${project._id}:cover`,
      name,
      subtitle,
      externalUrl: project.externalUrl,
      image: {
        src: coverUrl,
        fullSrc: coverFullUrl,
        alt: coverAlt,
        aspectRatio: coverRatio,
      },
    };

    const additionalItems: WorkGalleryItem[] = (project.additionalImages ?? []).flatMap(
      (img, idx) => {
        const src = resolveSanityImageUrl(img, 2048);
        const fullSrc = resolveSanityImageUrl(img);
        if (!src) return [];
        return [
          {
            id: `${project._id}:${img._key || idx}`,
            name,
            subtitle,
            externalUrl: project.externalUrl,
            image: {
              src,
              fullSrc,
              alt: getAltText(img, name),
              aspectRatio: resolveSanityAspectRatio(img),
            },
          },
        ];
      },
    );

    return [coverItem, ...additionalItems];
  });
}

type WorkGalleryCardProps = {
  item: WorkSlide | WorkGalleryItem;
  index?: number;
  onCardClick: (e: MouseEvent<HTMLElement>, item: WorkSlide | WorkGalleryItem) => void;
};

function WorkGalleryCard({ item, onCardClick }: WorkGalleryCardProps) {
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
            onCardClick(e as unknown as MouseEvent<HTMLElement>, item);
          }
        },
      };

  return (
    <article className="group flex flex-col w-full max-w-[682px] mx-auto">
      <Tag
        {...linkProps}
        onClick={(e) => onCardClick(e as unknown as MouseEvent<HTMLElement>, item)}
        className="group/image block w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#135E4F] rounded-[8px]"
        aria-label={`View ${item.name}`}
      >
        {/* Image Container: Strict 3:2 aspect ratio, edge-to-edge cover, 8px radius */}
        <div className="w-full aspect-[3/2] relative overflow-hidden rounded-[8px] bg-[#f5f5f7] flex items-center justify-center border border-[#232323]/10 cursor-pointer">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            width={1800}
            height={1200}
            unoptimized={true}
            priority={true}
            quality={100}
            sizes="(max-width: 768px) 100vw, 682px"
            className="w-full h-full object-cover block cursor-pointer"
          />
        </div>
      </Tag>

      {/* Caption: Title followed by Subtitle strictly left-aligned */}
      <div className="mt-4 flex flex-col items-start text-left w-full gap-0.5">
        <h2
          className="text-[16px] font-[500] text-neutral-900 leading-snug tracking-tight"
          style={{ fontSize: "16px", fontWeight: 500 }}
        >
          {item.name}
        </h2>
        {item.subtitle && (
          <p
            className="text-[14px] font-[400] leading-normal text-neutral-500"
            style={{
              fontSize: "14px",
              fontWeight: 400,
              color: "#737373",
            }}
          >
            {item.subtitle}
          </p>
        )}
      </div>
    </article>
  );
}

export function WorkGallery({
  projects,
  items: directItems,
  fallbackProjects,
}: WorkGalleryProps) {
  const items = useMemo(() => {
    if (projects && projects.length > 0) {
      return createItemsFromSanity(projects);
    }
    if (directItems && directItems.length > 0) {
      return directItems;
    }
    if (fallbackProjects && fallbackProjects.length > 0) {
      return createWorkSlides(fallbackProjects);
    }
    return [];
  }, [projects, directItems, fallbackProjects]);

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

  const currentIndex = lightboxItem
    ? Math.max(
        0,
        items.findIndex((i) => i.id === lightboxItem.id),
      )
    : 0;

  return (
    <section aria-label="Work Projects" className="w-full">
      {/* Symmetrical vertical rhythm: 16px between cards matching 16px thumbnail-to-text */}
      <div className="w-full flex flex-col items-center gap-y-4">
        {items.map((item, index) => (
          <WorkGalleryCard
            key={item.id}
            item={item}
            index={index}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

      {/* Lightbox Modal: Maximized open state */}
      {lightboxItem && (
        <div
          className="fixed inset-0 h-[100dvh] z-50 flex flex-col items-center justify-evenly px-4 bg-black/90 backdrop-blur-md cursor-pointer animate-in fade-in duration-200 select-none"
          onClick={() => setLightboxItem(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Full preview of ${lightboxItem.name}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={("fullSrc" in lightboxItem.image && lightboxItem.image.fullSrc) || lightboxItem.image.src}
            alt={lightboxItem.image.alt}
            className="z-10 max-h-[85vh] sm:max-h-[87vh] max-w-[96vw] sm:max-w-[98vw] w-auto h-auto object-contain rounded-[8px] pointer-events-auto shadow-2xl cursor-default"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Bottom: Round navigation controls (32px size) with image counter centered horizontally */}
          <nav
            className="flex items-center justify-center gap-3 sm:gap-4 z-20 shrink-0 h-[32px]"
            onClick={(e) => e.stopPropagation()}
            aria-label="Modal image navigation"
          >
            <button
              type="button"
              onClick={handlePrev}
              className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full bg-[#505050]/90 hover:bg-[#656565] active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-label="Previous image"
            >
              <svg
                className="w-[16px] h-[16px]"
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

            {/* Counter: e.g. 1 / 18 */}
            <span
              className="font-mono text-[13px] sm:text-[14px] text-white/90 select-none tracking-wider tabular-nums flex items-center"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>{currentIndex + 1}</span>
              <span className="text-white/40 mx-1.5 font-sans font-light select-none">/</span>
              <span>{items.length}</span>
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="w-[32px] h-[32px] min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px] rounded-full bg-[#505050]/90 hover:bg-[#656565] active:scale-95 text-white flex items-center justify-center transition-all duration-150 shadow-md focus:outline-none focus-visible:ring-1 focus-visible:ring-white cursor-pointer"
              aria-label="Next image"
            >
              <svg
                className="w-[16px] h-[16px]"
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
