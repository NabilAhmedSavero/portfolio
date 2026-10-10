"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import type { WorkSlide } from "@/data/projects";

function getSubtleRotation(index: number, id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const direction = index % 2 === 0 ? -1 : 1;
  const magnitude = 0.4 + (Math.abs(hash) % 105) / 100;
  return Number((direction * Math.min(1.5, Math.max(0.3, magnitude))).toFixed(2));
}

const emptySubscribe = () => () => {};

type FocusState = "idle" | "opening" | "open" | "closing";

export function WorkGallery({ items }: { items: readonly WorkSlide[] }) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [focusState, setFocusState] = useState<FocusState>("idle");
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const cardRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
  const focusedCardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const rotations = useMemo(() => {
    return items.map((item, index) => getSubtleRotation(index, item.id));
  }, [items]);

  // Lock body scroll while card is focused without layout shift
  useEffect(() => {
    if (focusedIndex === null) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [focusedIndex]);

  const onCardClick = (index: number) => {
    const cardEl = cardRefs.current.get(index);
    if (!cardEl) return;
    returnFocusRef.current = cardEl;
    const rect = cardEl.getBoundingClientRect();
    setOriginRect(rect);
    setFocusedIndex(index);
    setFocusState("opening");
  };

  const closeFocus = useCallback(() => {
    if (focusedIndex === null || focusState === "closing") return;

    const focusedCard = focusedCardRef.current;
    const overlay = overlayRef.current;
    const originalCard = cardRefs.current.get(focusedIndex);

    if (!focusedCard || !overlay || !originalCard) {
      if (originalCard) originalCard.style.opacity = "";
      setFocusedIndex(null);
      setFocusState("idle");
      returnFocusRef.current?.focus({ preventScroll: true });
      return;
    }

    setFocusState("closing");

    const currentRect = originalCard.getBoundingClientRect();
    const targetRect = focusedCard.getBoundingClientRect();
    const dx = currentRect.left + currentRect.width / 2 - (targetRect.left + targetRect.width / 2);
    const dy = currentRect.top + currentRect.height / 2 - (targetRect.top + targetRect.height / 2);
    const scale = currentRect.width / targetRect.width;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const rotation = isMobile ? 0 : rotations[focusedIndex];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cardAnim = focusedCard.animate(
      [
        {
          transform: "translate(0px, 0px) scale(1) rotate(0deg)",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.25), 0 30px 60px -15px rgba(0, 0, 0, 0.3)",
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${rotation}deg)`,
          boxShadow: "0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 12px 28px -6px rgba(0, 0, 0, 0.07)",
        },
      ],
      {
        duration: reducedMotion ? 1 : 320,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "forwards",
      },
    );

    overlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      {
        duration: reducedMotion ? 1 : 280,
        easing: "ease-out",
        fill: "forwards",
      },
    );

    cardAnim.onfinish = () => {
      originalCard.style.opacity = "";
      setFocusedIndex(null);
      setFocusState("idle");
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [focusedIndex, focusState, rotations]);

  // Lift-to-Focus entry animation
  useLayoutEffect(() => {
    if (focusState !== "opening" || focusedIndex === null || !originRect) return;

    const focusedCard = focusedCardRef.current;
    const overlay = overlayRef.current;
    const originalCard = cardRefs.current.get(focusedIndex);
    if (!focusedCard || !overlay) return;

    const targetRect = focusedCard.getBoundingClientRect();
    const dx = originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
    const dy = originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
    const scale = originRect.width / targetRect.width;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const rotation = isMobile ? 0 : rotations[focusedIndex];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (originalCard) {
      originalCard.style.opacity = "0";
    }

    const cardAnim = focusedCard.animate(
      [
        {
          transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${rotation}deg)`,
          boxShadow: "0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 12px 28px -6px rgba(0, 0, 0, 0.07)",
        },
        {
          transform: "translate(0px, 0px) scale(1) rotate(0deg)",
          boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.25), 0 30px 60px -15px rgba(0, 0, 0, 0.3)",
        },
      ],
      {
        duration: reducedMotion ? 1 : 400,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    );

    const overlayAnim = overlay.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      {
        duration: reducedMotion ? 1 : 320,
        easing: "ease-out",
        fill: "forwards",
      },
    );

    cardAnim.onfinish = () => {
      setFocusState("open");
    };

    return () => {
      cardAnim.cancel();
      overlayAnim.cancel();
    };
  }, [focusState, focusedIndex, originRect, rotations]);

  // Escape to close
  useEffect(() => {
    if (focusedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeFocus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, closeFocus]);

  const focusedItem = focusedIndex !== null ? items[focusedIndex] : null;

  return (
    <>
      <div className="work-gallery" role="region" aria-label="Works vertical gallery">
        {items.length ? (
          items.map((item, index) => {
            const rotation = rotations[index];
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(index, el);
                  else cardRefs.current.delete(index);
                }}
                type="button"
                className="work-print-card"
                style={
                  {
                    "--card-image-ratio": item.image.aspectRatio ?? 1.6,
                    "--card-rotation": `${rotation}deg`,
                  } as CSSProperties
                }
                onClick={() => onCardClick(index)}
                aria-label={`Inspect ${item.name}`}
              >
                <span className="work-print-image-frame">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 720px"
                    draggable={false}
                    priority={index === 0}
                  />
                </span>
                <span className="work-print-title">{item.name}</span>
              </button>
            );
          })
        ) : (
          <p className="work-gallery-empty">No work images published yet.</p>
        )}
      </div>

      {mounted &&
        focusedItem &&
        createPortal(
          <div
            ref={overlayRef}
            className="work-focus-backdrop"
            onClick={closeFocus}
            role="dialog"
            aria-modal="true"
            aria-label={focusedItem.name}
          >
            <div
              ref={focusedCardRef}
              className="work-focused-card"
              onClick={(e) => e.stopPropagation()}
              style={
                {
                  "--card-image-ratio": focusedItem.image.aspectRatio ?? 1.6,
                } as CSSProperties
              }
            >
              <div className="work-print-image-frame">
                <Image
                  src={focusedItem.image.src}
                  alt={focusedItem.image.alt}
                  fill
                  sizes="(max-width: 1200px) 92vw, 1200px"
                  draggable={false}
                  priority
                />
              </div>
              <div className="work-print-title">{focusedItem.name}</div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
