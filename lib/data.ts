import portfolioData from "./portfolio-data.json";

export interface ProjectStat {
  label: string;
  sub: string;
}

export interface ProjectSection {
  title: string;
  content: string;
}

export interface Project {
  slug: string;
  num: string;
  title: string;
  fullTitle: string;
  category: string;
  tags: string[];
  year: string;
  description: string;
  role: string;
  tech: string[];
  challenge: string;
  outcome: string;
  liveUrl: string;
  githubUrl: string;
  accent: string;
  bgGradient: string;
  image: string;
  themeClass: string;
  badge: string;
  stats: ProjectStat[];
  sections: ProjectSection[];
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  location?: string;
  description: string;
  tech: string[];
}

export interface EducationInfo {
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
  desc?: string;
}

export interface PrincipleItem {
  num: string;
  word: string;
  desc: string;
}

export const education: EducationInfo = portfolioData.education;

export const personalInfo = {
  ...portfolioData.personalInfo,
  education: portfolioData.education,
};

export const projects: Project[] = (portfolioData.works || []).map((w) => ({
  slug: w.slug || "",
  num: w.num || "",
  title: w.title || "",
  fullTitle: w.fullTitle || w.title || "",
  category: w.category || (w.tags ? w.tags.join(" · ") : ""),
  tags: (w.tags || []) as string[],
  year: w.year || "",
  description: w.description || "",
  role: w.role || "Developer",
  tech: (w.tech || w.tags || []) as string[],
  challenge: w.challenge || "",
  outcome: w.outcome || "",
  liveUrl: w.liveUrl || "#",
  githubUrl: w.githubUrl || "#",
  accent: w.accent || "#3b82f6",
  bgGradient: w.bgGradient || "from-[#1a1610] to-[#0f0f0f]",
  image: w.image || "/projects/dummy_img_1_new.webp",
  themeClass: w.themeClass || "is_blue",
  badge: w.badge || w.category || "",
  stats: (w.stats || []) as ProjectStat[],
  sections: (w.sections || []) as ProjectSection[],
}));

export const experience: ExperienceItem[] = ((portfolioData.experiences || []) as any[]).map((e) => ({
  year: e.period || e.year || "",
  role: e.role || "",
  company: e.company || "",
  location: e.location || "",
  description: e.desc || e.description || "",
  tech: (e.tags || e.tech || []) as string[],
}));

export const skills = portfolioData.skills as {
  frontend: string[];
  backend: string[];
  tools: string[];
};

export const principles: PrincipleItem[] = portfolioData.principles as PrincipleItem[];

export const marqueeItems: string[] = [
  "FULL STACK", "REACT", "NODE.JS", "MONGODB", "REST APIs",
  "NEXT.JS", "TYPESCRIPT", "SOCKET.IO", "AI INTEGRATION", "UI/UX",
  "VERCEL", "FIGMA", "PERFORMANCE", "CLEAN CODE", "OPEN TO WORK",
];
