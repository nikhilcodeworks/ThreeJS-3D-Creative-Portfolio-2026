"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let mouseX = 0,
      mouseY = 0;
    let ringX = 0,
      ringY = 0;
    let raf: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Dot follows instantly
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
      label.style.transform = `translate(${mouseX}px, ${mouseY + 70}px)`;
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.1);
      ringY = lerp(ringY, mouseY, 0.1);
      ring.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
      raf = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener("mousemove", onMouseMove);

    // State changes for hover targets
    const handleEnterLink = () => {
      dot.classList.add("cursor-pink");
      ring.classList.add("cursor-hover");
      label.textContent = "OPEN";
      label.classList.add("visible");
    };
    const handleLeaveLink = () => {
      dot.classList.remove("cursor-pink");
      ring.classList.remove("cursor-hover");
      label.classList.remove("visible");
    };
    const handleEnterProject = () => {
      dot.classList.add("cursor-pink");
      ring.classList.add("cursor-project");
      label.textContent = "VIEW →";
      label.classList.add("visible");
    };
    const handleLeaveProject = () => {
      dot.classList.remove("cursor-pink");
      ring.classList.remove("cursor-project");
      label.classList.remove("visible");
    };
    const handleEnterText = () => {
      dot.classList.add("cursor-pink");
      ring.classList.add("cursor-pink");
    };
    const handleLeaveText = () => {
      dot.classList.remove("cursor-pink");
      ring.classList.remove("cursor-pink");
    };

    const addListeners = () => {
      document
        .querySelectorAll("a, button, .magnetic-btn")
        .forEach((el) => {
          el.addEventListener("mouseenter", handleEnterLink);
          el.addEventListener("mouseleave", handleLeaveLink);
        });

      document.querySelectorAll(".project-row").forEach((el) => {
        el.addEventListener("mouseenter", handleEnterProject);
        el.addEventListener("mouseleave", handleLeaveProject);
      });

      document
        .querySelectorAll("p, h1, h2, h3, h4, h5, h6, .line-wrap, .skill-item, .contact-link, .timeline-item, .section-desc, .project-tag")
        .forEach((el) => {
          el.addEventListener("mouseenter", handleEnterText);
          el.addEventListener("mouseleave", handleLeaveText);
        });
    };

    // Add after a short delay to catch dynamic elements
    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
