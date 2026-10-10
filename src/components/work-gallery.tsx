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
  type PointerEvent as ReactPointerEvent,
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
  const [isFocused, setIsFocused] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const [dockNode, setDockNode] = useState<HTMLElement | null>(null);

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const hasMoved = useRef(false);

  // Persistent dock discovery for route transitions
  useEffect(() => {
    const updateDock = () => {
      const el = document.getElementById("work-gallery-dock");
      setDockNode(el);
    };

    updateDock();
    const raf = requestAnimationFrame(updateDock);
    const observer = new MutationObserver(updateDock);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIsFocused(false);
      setActiveIndex((prev) =>
        Math.max(0, Math.min(items.length - 1, prev + delta)),
      );
    },
    [items.length],
  );

  // Keyboard navigation & Escape to exit focus
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFocused) {
          e.preventDefault();
          setIsFocused(false);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isFocused, step]);

  // Reliable threshold swipe (no complex 1:1 interpolation)
  const onPointerDown = (e: ReactPointerEvent<HTMLElement>) => {
    if (isFocused) return;
    // Don't drag if clicking buttons, dock, or navigation
    if (
      (e.target as HTMLElement).closest(
        ".site-nav, #work-gallery-dock, .work-floating-dock-fallback, button, a",
      )
    ) {
      return;
    }
    if (e.button !== 0 && e.pointerType === "mouse") return;

    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    hasMoved.current = false;
    setIsGrabbing(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (dragStartX.current === null) return;
    const dx = Math.abs(e.clientX - dragStartX.current);
    const dy = Math.abs(e.clientY - (dragStartY.current ?? e.clientY));
    if (dx > 8 || dy > 8) {
      hasMoved.current = true;
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    if (dragStartX.current === null) return;
    setIsGrabbing(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    const deltaX = e.clientX - dragStartX.current;
    const deltaY = e.clientY - (dragStartY.current ?? e.clientY);

    dragStartX.current = null;
    dragStartY.current = null;

    // Threshold swipe: swipe > 50px horizontally steps by 1
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < -50) {
        step(1); // Swipe left -> next
      } else if (deltaX > 50) {
        step(-1); // Swipe right -> prev
      }
    }
  };

  const onPointerCancel = () => {
    setIsGrabbing(false);
    dragStartX.current = null;
    dragStartY.current = null;
    hasMoved.current = false;
  };

  const dockControls = (
    <div
      className="work-gallery-dock-controls"
      role="group"
      aria-label="Gallery slide controls"
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        className="work-dock-btn"
        onClick={(e) => {
          e.stopPropagation();
          step(-1);
        }}
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
        onClick={(e) => {
          e.stopPropagation();
          step(1);
        }}
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
      <button
        type="button"
        className="work-dock-btn"
        onClick={(e) => {
          e.stopPropagation();
          setIsFocused(false);
          setActiveIndex(0);
        }}
        disabled={activeIndex === 0}
        aria-label="Reset to first project"
        title="Reset to first project"
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
          <path d="M3.5 10a6.5 6.5 0 1 0 1.9-4.6L3.5 7.5" />
          <path d="M3.5 3.5v4h4" />
        </svg>
      </button>
    </div>
  );

  return (
    <section
      className={`work-gallery-stage${isGrabbing ? " is-grabbing" : ""}`}
      aria-label="Hanging photographs gallery"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {/* Click-to-focus dark overlay with backdrop blur */}
      {isFocused && (
        <div
          className="work-focus-dimmer"
          onClick={(e) => {
            e.stopPropagation();
            setIsFocused(false);
          }}
          aria-label="Close focus"
        />
      )}

      {/* String Layer: Z-index 2 (BEHIND photos at Z:5) */}
      <div className="work-string-line" aria-hidden="true">
        <svg
          className="work-string-svg"
          viewBox="0 0 1000 30"
          preserveAspectRatio="none"
        >
          {/* Subtle thin hanging wire with natural catenary dip */}
          <path
            d="M 0 10 Q 500 23 1000 10"
            stroke="rgba(0, 0, 0, 0.05)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M 0 9 Q 500 22 1000 9"
            stroke="rgba(140, 130, 120, 0.45)"
            strokeWidth="1.2"
            strokeDasharray="6,2"
            fill="none"
          />
        </svg>
      </div>

      {/* Hanging photographs track: Z-index 5 (IN FRONT of string) */}
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
                data-focused={offset === 0 && isFocused ? "true" : undefined}
                style={
                  {
                    "--card-image-ratio": item.image.aspectRatio ?? 1.6,
                  } as CSSProperties
                }
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMoved.current) return;
                  if (offset === -1) {
                    step(-1);
                  } else if (offset === 1) {
                    step(1);
                  } else if (offset === 0) {
                    setIsFocused((prev) => !prev);
                  }
                }}
                aria-current={offset === 0 ? "true" : undefined}
                aria-label={`${item.name} (${index + 1} of ${items.length})`}
              >
                {/* Clothespin Front: Z-index 15 (IN FRONT of photo) */}
                <WoodenClip style={{ left: "50%", transform: "translateX(-50%)" }} />

                <div className="work-print-image-frame">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 62vw, 640px"
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

      {/* Floating dock controls: Z-index 50 (ABOVE everything) */}
      {mounted &&
        (dockNode ? (
          createPortal(dockControls, dockNode)
        ) : (
          <div className="work-floating-dock-fallback">{dockControls}</div>
        ))}
    </section>
  );
}
