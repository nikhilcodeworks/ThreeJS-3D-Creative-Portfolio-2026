import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nikhil — Full Stack Developer & Creative Frontend Engineer",
  description:
    "I build scalable full-stack applications and craft immersive digital experiences. MERN stack, Next.js, AI integrations, and real-time systems.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Next.js",
    "MERN Stack",
    "Frontend Developer",
    "Delhi NCR",
    "India",
    "nikhilcodeworks",
  ],
  authors: [{ name: "Nikhil", url: "https://github.com/nikhilcodeworks" }],
  creator: "Nikhil",
  openGraph: {
    type: "website",
    locale: "en_IN",
    title: "Nikhil — Full Stack Developer & Creative Frontend Engineer",
    description:
      "I build scalable full-stack applications and craft immersive digital experiences.",
    siteName: "Nikhil Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nikhil — Full Stack Developer",
    description: "Building digital products that actually work.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Patrick+Hand&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
