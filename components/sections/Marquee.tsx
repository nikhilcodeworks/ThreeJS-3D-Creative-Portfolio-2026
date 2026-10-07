"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { marqueeItems } from "@/lib/data";

gsap.registerPlugin(ScrollTrigger);

export default function Marquee() {
  const items = [...marqueeItems, ...marqueeItems]; // double for seamless loop

  return (
    <div
      className="marquee-section"
      aria-hidden="true"
      role="presentation"
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <div key={i} className="marquee-item">
            {item}
            {i !== items.length - 1 && (
              <span className="accent" style={{ color: "var(--color-accent)" }}>
                ·
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
