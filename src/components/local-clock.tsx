"use client";

import { useEffect, useState } from "react";

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Makassar", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
});

export function LocalClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const update = () => setNow(new Date());
    const initial = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1_000);
    return () => { window.clearTimeout(initial); window.clearInterval(interval); };
  }, []);

  return (
    <span className="home-time">
      <svg className="home-location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <time dateTime={now?.toISOString()} aria-label="Current time in Balikpapan">
        {now ? timeFormat.format(now) : "--:--"} GMT+8
      </time>
    </span>
  );
}
