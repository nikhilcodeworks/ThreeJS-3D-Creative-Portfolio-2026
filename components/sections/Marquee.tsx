"use client";
import { marqueeItems } from "@/lib/data";

export default function Marquee() {
  // 4 sets to guarantee infinite seamless loop without any blank gaps or cutoff
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div
      className="marquee-section"
      aria-hidden="true"
      role="presentation"
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <div key={i} className="marquee-item">
            <span>{item}</span>
            <span className="accent" aria-hidden="true">
              ·
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
