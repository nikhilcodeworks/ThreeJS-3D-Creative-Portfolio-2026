"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(loaderRef.current, {
            yPercent: -100,
            duration: 1,
            ease: "power4.inOut",
            delay: 0.1,
            onComplete,
          });
        },
      });

      // Animate progress line
      tl.to(lineRef.current, {
        scaleX: 1,
        duration: 1.8,
        ease: "power2.inOut",
      });

      // Animate counter 0 → 100
      tl.to(
        { val: 0 },
        {
          val: 100,
          duration: 1.8,
          ease: "power2.inOut",
          onUpdate: function () {
            setCount(Math.round(this.targets()[0].val));
          },
        },
        "<"
      );

      // Brief pause with text
      tl.to(textRef.current, { opacity: 1, duration: 0.4 }, "-=0.5");
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={loaderRef} className="loader" aria-hidden="true">
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          textAlign: "center",
          width: "100%",
          padding: "0 2rem",
        }}
      >
        <div ref={counterRef} className="loader__counter">
          {String(count).padStart(2, "0")}
        </div>

        <div className="loader__line" style={{ margin: "2rem auto" }}>
          <div ref={lineRef} className="loader__line-inner" />
        </div>

        <p ref={textRef} className="loader__text" style={{ opacity: 0 }}>
          Initializing Portfolio Experience
        </p>
      </div>

      {/* Corner labels */}
      <span
        className="loader__text"
        style={{ position: "absolute", top: "2rem", left: "2.5rem" }}
      >
        Nikhil — Portfolio 2026
      </span>
      <span
        className="loader__text"
        style={{ position: "absolute", top: "2rem", right: "2.5rem" }}
      >
        Delhi NCR, India
      </span>
      <span
        className="loader__text"
        style={{ position: "absolute", bottom: "2rem", left: "2.5rem" }}
      >
        Full Stack Developer
      </span>
      <span
        className="loader__text"
        style={{ position: "absolute", bottom: "2rem", right: "2.5rem" }}
      >
        {count}%
      </span>
    </div>
  );
}
