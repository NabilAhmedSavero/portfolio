"use client";

import { useEffect, useState } from "react";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Makassar",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  hourCycle: "h23",
});

type LocalClockProps = {
  className?: string;
};

export function LocalClock({ className }: LocalClockProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1_000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <span
      className={className ?? "tabular-nums font-mono text-[14px] leading-[20px] text-[#737373]"}
      suppressHydrationWarning
    >
      {now ? timeFormat.format(now) : "--:--:--"}
    </span>
  );
}
