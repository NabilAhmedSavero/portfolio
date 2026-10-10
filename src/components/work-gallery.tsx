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

// Scaled down by 50% (8px x 25px) so it only bites the top margin without covering photo
function WoodenClip({ style }: { style?: CSSProperties }) {
  return (
    <div className="work-wooden-clip" style={style} aria-hidden="true">
      <svg
        width="8"
        height="25"
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

  // Live 1:1 drag physics tracking refs
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const isPointerCaptured = useRef(false);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  const currentDragX = useRef(0);
  const pointerHistory = useRef<{ x: number; time: number }[]>([]);
  const hasMoved = useRef(false);

  // Lock scrollbars strictly while on /work to eliminate flash
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  // Persistent dock discovery for route transitions
  useEffect(() => {
    const updateDock = () => {
      setDockNode(document.getElementById("work-gallery-dock"));
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

  useEffect(() => {
    if (isGrabbing) {
      document.body.classList.add("is-gallery-dragging");
    } else {
      document.body.classList.remove("is-gallery-dragging");
    }
    return () => {
      document.body.classList.remove("is-gallery-dragging");
    };
  }, [isGrabbing]);

  // 1:1 Live Drag & Swipe gesture handling
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

    isDragging.current = true;
    isPointerCaptured.current = false;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    currentDragX.current = 0;
    hasMoved.current = false;
    pointerHistory.current = [{ x: e.clientX, time: performance.now() }];
    setIsGrabbing(true);

    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging.current || dragStartX.current === null) return;

    const dx = e.clientX - dragStartX.current;
    const dy = Math.abs(e.clientY - (dragStartY.current ?? e.clientY));

    // Only engage drag mode and pointer capture after genuine movement > 12px
    if (Math.abs(dx) > 12 || dy > 12) {
      hasMoved.current = true;
      if (!isPointerCaptured.current) {
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
          isPointerCaptured.current = true;
        } catch {
          // Ignore
        }
      }
    }

    // Rubber-band resistance at gallery boundaries
    let deltaX = dx;
    if (
      (activeIndex === 0 && deltaX > 0) ||
      (activeIndex === items.length - 1 && deltaX < 0)
    ) {
      deltaX *= 0.32;
    }

    currentDragX.current = deltaX;

    // Direct 1:1 live movement on DOM
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${deltaX}px, 0, 0)`;
    }

    const now = performance.now();
    pointerHistory.current.push({ x: e.clientX, time: now });
    if (pointerHistory.current.length > 5) {
      pointerHistory.current.shift();
    }
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLElement>) => {
    if (!isDragging.current || dragStartX.current === null) return;
    isDragging.current = false;
    setIsGrabbing(false);

    if (isPointerCaptured.current) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
      isPointerCaptured.current = false;
    }

    const deltaX = currentDragX.current;
    const now = performance.now();
    const history = pointerHistory.current;

    let velocity = 0;
    if (history.length >= 2) {
      const oldest = history[0];
      const dt = now - oldest.time;
      if (dt > 10) {
        velocity = (e.clientX - oldest.x) / dt;
      }
    }

    const startX = dragStartX.current;
    const startY = dragStartY.current;
    dragStartX.current = null;
    dragStartY.current = null;
    currentDragX.current = 0;

    const dist = Math.hypot(
      e.clientX - startX,
      e.clientY - (startY ?? e.clientY),
    );

    // If movement was small (< 14px), it's a tap/click: DO NOT drag-step!
    // The native onClick on the card handles navigation vs focus cleanly.
    if (dist < 14) {
      return;
    }

    // Evaluate drag velocity and distance to determine next/prev or snap back
    let targetDelta = 0;
    const swipeDistance = 45;
    const swipeVelocity = 0.28;

    if (deltaX < -swipeDistance || velocity < -swipeVelocity) {
      if (activeIndex < items.length - 1) {
        targetDelta = 1;
      }
    } else if (deltaX > swipeDistance || velocity > swipeVelocity) {
      if (activeIndex > 0) {
        targetDelta = -1;
      }
    }

    // Smoothly animate track back to 0
    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
      trackRef.current.style.transform = "translate3d(0, 0, 0)";
    }

    if (targetDelta !== 0) {
      setIsFocused(false);
      setActiveIndex((prev) =>
        Math.max(0, Math.min(items.length - 1, prev + targetDelta)),
      );
    }

    setTimeout(() => {
      hasMoved.current = false;
    }, 50);
  };

  const onPointerCancel = () => {
    isDragging.current = false;
    setIsGrabbing(false);
    if (isPointerCaptured.current) {
      isPointerCaptured.current = false;
    }
    dragStartX.current = null;
    dragStartY.current = null;
    currentDragX.current = 0;

    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)";
      trackRef.current.style.transform = "translate3d(0, 0, 0)";
    }

    setTimeout(() => {
      hasMoved.current = false;
    }, 50);
  };

  const activeItem = items[activeIndex];

  // Strictly only controls: [ < ] [ 1 / 6 ] [ > ] [ Reset ]
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
        className={`work-dock-btn text-[#135E4F] ${activeIndex === 0 ? "opacity-10 pointer-events-none cursor-default" : ""}`}
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
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.5 15l-5-5 5-5" />
        </svg>
      </button>

      <span className="work-dock-counter font-mono" aria-live="polite">
        {items.length ? `${activeIndex + 1} / ${items.length}` : "0 / 0"}
      </span>

      <button
        type="button"
        className={`work-dock-btn text-[#135E4F] ${activeIndex === items.length - 1 ? "opacity-10 pointer-events-none cursor-default" : ""}`}
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
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7.5 5l5 5-5 5" />
        </svg>
      </button>

      <button
        type="button"
        className={`work-dock-btn work-dock-btn-reset text-[#135E4F] opacity-10 ${activeIndex === 0 ? "pointer-events-none cursor-default" : "hover:opacity-100"}`}
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
          strokeWidth="2.25"
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
      {/* Atomic Hanging Assembly: String and Photo Cards bound together */}
      <div className="work-hanging-assembly">
        {/* String Layer: Z-index 2 (BEHIND photos at Z:5), anchored to clip notch */}
        <div className="work-string-line" aria-hidden="true">
          <svg
            className="work-string-svg"
            viewBox="0 0 1000 16"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 3 Q 500 7 1000 3"
              stroke="rgba(0, 0, 0, 0.05)"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M 0 2.5 Q 500 6.5 1000 2.5"
              stroke="rgba(140, 130, 120, 0.45)"
              strokeWidth="1.2"
              strokeDasharray="6,2"
              fill="none"
            />
          </svg>
        </div>

        {/* Carousel Track: translates live 1:1 during drag */}
        <div ref={trackRef} className="work-carousel-track">
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
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasMoved.current) return;
                    if (index !== activeIndex) {
                      // CRITICAL RULE: If clicked card is NOT center card, ONLY navigate!
                      setIsFocused(false);
                      setActiveIndex(index);
                    } else {
                      // CRITICAL RULE: ONLY open focus overlay if clicked card IS center active card!
                      setIsFocused(true);
                    }
                  }}
                  aria-current={offset === 0 ? "true" : undefined}
                  aria-label={`${item.name} (${index + 1} of ${items.length})`}
                >
                  {/* Scaled-down Wooden Clip: clamps white margin only, no photo overlap */}
                  <WoodenClip style={{ left: "50%", transform: "translateX(-50%)" }} />

                  {/* Clean blank photographic print: image only, no title text */}
                  <div className="work-print-image-frame">
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 65vw, 680px"
                      draggable={false}
                      priority={Math.abs(offset) <= 1}
                    />
                  </div>
                </article>
              );
            })
          ) : (
            <p className="work-gallery-empty">No work images published yet.</p>
          )}
        </div>
      </div>

      {/* Floating dock controls in Navbar */}
      {mounted &&
        (dockNode ? (
          createPortal(dockControls, dockNode)
        ) : (
          <div className="work-floating-dock-fallback">{dockControls}</div>
        ))}

      {/* Lift-to-Focus Portal: Z-index 9999 on body.
          STRIPPED OF ALL PHYSICAL AESTHETICS (no white frame, no clip, no string, no shadows).
          Displays ONLY the raw project image maximized with subtle backdrop blur. */}
      {mounted &&
        isFocused &&
        activeItem &&
        createPortal(
          <div
            className="work-focus-portal fixed inset-0 w-full h-[100dvh] backdrop-blur-[4px]"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            onClick={() => setIsFocused(false)}
            onTouchEnd={(e) => {
              if (e.target === e.currentTarget) {
                setIsFocused(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Focused view of ${activeItem.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.image.src}
              alt={activeItem.image.alt}
              className="work-focus-raw-img"
              onClick={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}
    </section>
  );
}
