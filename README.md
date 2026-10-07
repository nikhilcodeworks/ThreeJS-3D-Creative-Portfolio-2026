<div align="center">

# 🌐 ThreeJS 3D Creative Portfolio 2026

<p align="center">
  <strong>Award-worthy 2026 interactive 3D developer portfolio featuring dynamic Three.js WebGL scenes, inertia smooth scrolling via Lenis, kinematic GSAP typography animations, and bespoke custom cursors.</strong>
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-tech-stack--architecture">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Category-Design%20%26%20Portfolio%20Showcases-db2777?style=for-the-badge" alt="Category: Design & Portfolio Showcases" />
  <img src="https://img.shields.io/badge/Tech%20Stack-Next.js%20%7C%20Three.js%20%7C%20React%20Three%20Fiber-10b981?style=for-the-badge" alt="Tech Stack: Next.js | Three.js | React Three Fiber" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-8b5cf6?style=for-the-badge" alt="Status: Production Ready" />
  <img src="https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge" alt="License: MIT" />
</p>

</div>

---

## 📌 Overview

**ThreeJS-3D-Creative-Portfolio-2026** is a flagship creative developer portfolio. Blending modern creative web design aesthetics with high-performance WebGL graphics, the application utilizes Next.js 16 App Router, React Three Fiber, React Three Drei, GSAP timeline sequencing, and ultra-smooth Lenis inertial scrolling to deliver an unforgettable digital experience.

---

## ✨ Key Features

- 🪐 **Interactive WebGL 3D Hero Scene**: Orbiting Earth globe, particle clouds, dynamic lighting, and camera parallax responsive to mouse movement.
- 🌊 **Ultra-Smooth Inertial Scroll**: Powered by `@studio-freight/lenis` for consistent cinematic page scrolling across all platforms.
- 🎭 **GSAP Micro-Interactions**: Complex scroll-triggered reveals, character split-text animations (`split-type`), and staggered entrance choreographies.
- 🎯 **Magnetic Custom Cursor**: Dynamic fluid cursor tracking mouse position with contextual hover enlargement and magnetic button snapping.
- ⚡ **Next.js 16 & React 19 Engine**: Built on the latest server components architecture, paired with Tailwind CSS v4 for zero-runtime styling overhead.
- 💼 **Deep Project Case Studies**: Dynamic routing (`/work/[slug]`) detailing architectural decisions, outcomes, and live links.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Core Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **3D & WebGL** | Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Motion & Scroll** | GSAP 3 (`@gsap/react`), Lenis Smooth Scroll, SplitType |
| **Styling & System** | Tailwind CSS v4, PostCSS, Custom Design Tokens |

---

## 📂 Project Structure

```text
ThreeJS-3D-Creative-Portfolio-2026/
├── app/
│   ├── layout.tsx             # Root layout with Lenis provider & cursor
│   ├── page.tsx               # Main single-page interactive showcase
│   ├── work/[slug]/           # Dynamic project case study pages
│   └── globals.css            # Custom CSS & Tailwind styles
├── components/
│   ├── 3d/
│   │   └── HeroScene.tsx      # R3F WebGL Canvas & 3D Earth shader
│   ├── sections/              # Hero, About, Work, Skills, Experience, Contact
│   └── ui/                    # CustomCursor, Loader, Marquee, Navbar, Footer
├── lib/
│   └── data.ts                # Project case studies & portfolio metadata
├── public/                    # 3D textures, WebP optimized assets & icons
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)

### Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

---

## 👤 Author
- **Nikhil** ([GitHub](https://github.com/nikhilcodeworks))

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.
