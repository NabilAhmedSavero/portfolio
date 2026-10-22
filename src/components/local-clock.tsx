"use client";

import { useEffect, useState } from "react";

const timeFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Makassar",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

type LocalClockProps = {
  city?: string;
  className?: string;
};

export function LocalClock({ city = "Balikpapan", className }: LocalClockProps) {
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
    <span className={className ?? "font-sans font-[450] text-[14px] leading-[20px] text-[#999999]"} suppressHydrationWarning>
      {city} • {now ? timeFormat.format(now) : "--:--"}
    </span>
  );
}
