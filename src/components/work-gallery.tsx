"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type TouchEvent,
} from "react";
import type { WorkSlide } from "@/data/projects";

const emptySubscribe = () => () => {};

function WoodenClip({ style }: { style?: CSSProperties }) {
  return (
    <div className="work-wooden-clip" style={style} aria-hidden="true">
      <svg
        width="16"
        height="50"
        viewBox="0 0 16 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="3" width="12" height="46" rx="2" fill="rgba(0, 0, 0, 0.12)" />
        <path
          d="M3 2 C3 1.5, 6 1.5, 6.5 2 L6.5 48 C6 48.5, 3 48.5, 3 48 Z"
          fill="#d8b277"
          stroke="#9b733b"
          strokeWidth="0.5"
        />
        <path
          d="M9.5 2 C10 1.5, 13 1.5, 13 2 L13 48 C13 48.5, 10 48.5, 9.5 48 Z"
          fill="#cda467"
          stroke="#9b733b"
          strokeWidth="0.5"
        />
        <rect x="5.5" y="14" width="5" height="5" rx="1" fill="#7d5929" opacity="0.35" />
        <rect x="2.5" y="21" width="11" height="7" rx="2" fill="#9e9e9e" stroke="#555555" strokeWidth="0.5" />
        <line x1="3" y1="24.5" x2="13" y2="24.5" stroke="#e0e0e0" strokeWidth="0.75" />
        <ellipse cx="8" cy="24.5" rx="2.5" ry="1.5" fill="#444444" />
      </svg>
    </div>
  );
}

export function WorkGallery({ items }: { items: readonly WorkSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const step = useCallback(
    (direction: -1 | 1) => {
      setActiveIndex((prev) =>
        Math.max(0, Math.min(items.length - 1, prev + direction)),
      );
    },
    [items.length],
  );

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [step]);

  // Touch swipe navigation for mobile
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        step(1);
      } else {
        step(-1);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const dockPortal = mounted && typeof document !== "undefined"
    ? document.getElementById("work-gallery-dock")
    : null;

  const dockControls = (
    <div
      className="work-gallery-dock-controls"
      role="group"
      aria-label="Gallery slide controls"
    >
      <button
        type="button"
        className="work-dock-btn"
        onClick={() => step(-1)}
        disabled={activeIndex === 0}
        aria-label="Previous project"
        title="Previous project (Left arrow)"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.5 15l-5-5 5-5" />
        </svg>
      </button>
      <span className="work-dock-counter" aria-live="polite">
        {items.length ? activeIndex + 1 : 0} / {items.length}
      </span>
      <button
        type="button"
        className="work-dock-btn"
        onClick={() => step(1)}
        disabled={activeIndex === items.length - 1}
        aria-label="Next project"
        title="Next project (Right arrow)"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7.5 5l5 5-5 5" />
        </svg>
      </button>
    </div>
  );

  return (
    <section
      className="work-gallery-stage"
      aria-label="Hanging photographs gallery"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Subtle horizontal string spanning viewport width */}
      <div className="work-string-line" aria-hidden="true">
        <svg
          className="work-string-svg"
          width="100%"
          height="12"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="6.5"
            x2="100%"
            y2="6.5"
            stroke="rgba(0, 0, 0, 0.08)"
            strokeWidth="2.5"
          />
          <line
            x1="0"
            y1="5"
            x2="100%"
            y2="5"
            stroke="#9e9185"
            strokeWidth="1.5"
            strokeDasharray="8,2"
          />
          <line
            x1="0"
            y1="4.5"
            x2="100%"
            y2="4.5"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="0.75"
          />
        </svg>
      </div>

      {/* Hanging photographs track */}
      <div className="work-carousel-track">
        {items.length ? (
          items.map((item, index) => {
            const offset = index - activeIndex;
            let position = "hidden-right";
            if (offset === 0) position = "active";
            else if (offset === -1) position = "prev";
            else if (offset === 1) position = "next";
            else if (offset < -1) position = "hidden-left";

            return (
              <article
                key={item.id}
                className="work-hanging-card"
                data-position={position}
                style={
                  {
                    "--card-image-ratio": item.image.aspectRatio ?? 1.6,
                  } as CSSProperties
                }
                onClick={() => {
                  if (offset === -1) step(-1);
                  else if (offset === 1) step(1);
                }}
                aria-current={offset === 0 ? "true" : undefined}
                aria-label={`${item.name} (${index + 1} of ${items.length})`}
              >
                <WoodenClip style={{ left: "20%" }} />
                <WoodenClip style={{ right: "20%" }} />
                <div className="work-print-image-frame">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 480px"
                    draggable={false}
                    priority={Math.abs(offset) <= 1}
                  />
                </div>
                <div className="work-print-title">{item.name}</div>
              </article>
            );
          })
        ) : (
          <p className="work-gallery-empty">No work images published yet.</p>
        )}
      </div>

      {/* Dock Controls: Portal to navbar if available, otherwise standalone floating dock */}
      {mounted &&
        (dockPortal ? (
          createPortal(dockControls, dockPortal)
        ) : (
          <div className="work-floating-dock-fallback">{dockControls}</div>
        ))}
    </section>
  );
}
