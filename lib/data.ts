// Portfolio Data — Based on Nikhil's actual resume data

export const personalInfo = {
  name: "Nikhil",
  fullName: "Nikhil",
  role: "Full Stack Developer",
  roleExtended: "Full Stack Developer & Creative Frontend Engineer",
  eyebrow: "Full Stack Dev · Creative Frontend",
  location: "Delhi NCR, India",
  email: "nikhilcode.io@gmail.com",
  github: "https://github.com/nikhilcodeworks",
  linkedin: "https://www.linkedin.com/in/nikhilcodes01/",
  studio: "THE RU3X",
  studioUrl: "#",
  availability: "Open to Opportunities · 2026",
  bio: "I build scalable full-stack applications and craft immersive digital experiences where clean engineering meets thoughtful design.",
  bioExtended: [
    "I'm a Full Stack Developer with a passion for building products that are both technically solid and visually refined. From REST APIs and database design to smooth frontend interactions — I care about the full picture.",
    "My work spans MERN-stack applications, AI-integrated tools, real-time systems, and client-facing websites. I founded THE RU3X, an AI automation studio, and continue to ship production-grade software.",
    "I'm drawn to projects where technical complexity meets meaningful UX — where the backend architecture and the frontend experience are equally considered.",
  ],
  education: {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Deenbandhu Chhotu Ram University (DCRUST)",
    location: "Murthal, Haryana",
    period: "2020 — 2024",
    cgpa: "7.6 / 10",
  },
};

export const projects = [
  {
    slug: "internship-portal",
    num: "01",
    title: "PORTAL",
    fullTitle: "Internship Portal",
    category: "Full Stack · MERN · Auth Systems",
    tags: ["React.js", "Node.js", "MongoDB", "JWT", "OAuth2"],
    year: "2025",
    description:
      "A full-stack internship platform connecting 500+ students with 50+ recruiters. Built with secure authentication, resume upload, and advanced search filtering.",
    role: "Full Stack Developer",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "OAuth2", "Multer", "Nodemailer"],
    challenge:
      "Designing a scalable RBAC system that handles resume uploads, email notifications, and dynamic listings while supporting 500+ concurrent users.",
    outcome: "Reduced job-search time by 40% through dynamic listing and filter UX. Scaled to support 500+ concurrent users.",
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilcodeworks",
    accent: "#c8a96e",
    bgGradient: "from-[#1a1610] to-[#0f0f0f]",
    sections: [
      { title: "01 — Overview", content: "Full-stack internship portal connecting students with companies. Built with MERN stack, JWT and OAuth2 auth, and advanced search." },
      { title: "02 — Problem", content: "Students struggled to find internships efficiently. Existing platforms were slow, generic, and lacked real-time filtering." },
      { title: "03 — Solution", content: "Dynamic listings with real-time filtering, secure auth, resume upload via Multer, and email notifications via Nodemailer." },
      { title: "04 — Architecture", content: "Express.js REST API with MongoDB, React.js SPA frontend, JWT refresh tokens, and OAuth2 social login." },
      { title: "05 — Result", content: "40% reduction in job-search time, 500+ active users, 50+ companies onboarded." },
    ],
  },
  {
    slug: "taskpilot",
    num: "02",
    title: "TASKPILOT",
    fullTitle: "TaskPilot — Project Management",
    category: "Product Design · React · Node",
    tags: ["MERN", "RBAC", "React.js", "REST API"],
    year: "2025",
    description:
      "Project management platform with role-based dashboards for Admins, Coordinators, Team Leads, and Interns. CRUD operations with timeline visualizations.",
    role: "Full Stack Developer",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "TailwindCSS", "JWT"],
    challenge:
      "Building a multi-tier permission system where four distinct user roles each had isolated data views, action scopes, and dashboard experiences.",
    outcome: "Reduced manual status-update effort by ~60%. Clean RBAC with timeline visualizations and real-time project tracking.",
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilcodeworks",
    accent: "#7dd3fc",
    bgGradient: "from-[#0a1520] to-[#0f0f0f]",
    sections: [
      { title: "01 — Overview", content: "A comprehensive project management tool with role-based access control, built for teams managing multiple projects and assignments." },
      { title: "02 — Problem", content: "Teams needed a way to manage tasks across different roles — without giving everyone access to everything." },
      { title: "03 — Design", content: "Four distinct dashboard views: Admin (full access), Coordinator (project management), Team Lead (task assignment), Intern (task completion)." },
      { title: "04 — Engineering", content: "Express.js backend with JWT-based RBAC middleware. React.js frontend with route guards and role-aware component rendering." },
      { title: "05 — Result", content: "60% reduction in manual status-update effort. Real-time progress tracking with timeline visualizations." },
    ],
  },
  {
    slug: "quotemind",
    num: "03",
    title: "QUOTEMIND",
    fullTitle: "AI Quote Generator",
    category: "AI Integration · Gemini · MERN",
    tags: ["Gemini API", "React.js", "MongoDB", "AI"],
    year: "2025",
    description:
      "AI-powered quote generation app using Google Gemini API. Generates quotes by mood, topic, or language with user auth and favorites persistence.",
    role: "Full Stack Developer",
    tech: ["React.js", "Node.js", "MongoDB", "Google Gemini API", "Vercel", "Render"],
    challenge:
      "Crafting effective prompt engineering for Gemini API to produce consistently high-quality, contextually relevant quotes across diverse moods and topics.",
    outcome: "200+ quotes generated per day during testing. Smooth integration of AI responses with real-time UI updates.",
    liveUrl: "#",
    githubUrl: "https://github.com/nikhilcodeworks",
    accent: "#86efac",
    bgGradient: "from-[#0a1a0f] to-[#0f0f0f]",
    sections: [
      { title: "01 — Overview", content: "AI-powered application that generates personalized quotes using Google Gemini API based on mood, topic, and language preferences." },
      { title: "02 — AI Architecture", content: "Gemini API integration with carefully engineered prompts for consistency. Response streaming for perceived performance." },
      { title: "03 — Features", content: "User authentication via MongoDB, save-favorites functionality, Quote of the Day auto-feature, and multi-language support." },
      { title: "04 — Deployment", content: "Frontend deployed on Vercel, backend on Render. Optimized for cold starts and API rate limits." },
      { title: "05 — Result", content: "200+ quotes/day in testing. Seamless AI response integration with real-time UI updates." },
    ],
  },
  {
    slug: "vulcan",
    num: "04",
    title: "VULCAN",
    fullTitle: "Vulcan Insurance Website",
    category: "Client Project · React · Responsive",
    tags: ["React.js", "HTML", "CSS", "JS", "Client Work"],
    year: "2026",
    description:
      "Comprehensive website for Vulcan Insurance Services offering life, health, motor, and financial products. Service listings, plan comparison, and 24/7 support.",
    role: "Freelance Frontend Developer",
    tech: ["React.js", "HTML5", "CSS3", "JavaScript", "Responsive Design"],
    challenge:
      "Creating a clear, trustworthy insurance website that handles complex product categories while remaining accessible and regulatory-compliant.",
    outcome: "Live production website serving North East India's retail financial community. Mobile-first, responsive, regulatory-compliant.",
    liveUrl: "#",
    githubUrl: "#",
    accent: "#fb923c",
    bgGradient: "from-[#1a0f0a] to-[#0f0f0f]",
    sections: [
      { title: "01 — Brief", content: "Develop a complete insurance website for Vulcan Insurance Services covering life, health, motor, and financial products." },
      { title: "02 — Design", content: "Clean, trustworthy visual design with clear service categorization, plan comparison tools, and strong calls-to-action." },
      { title: "03 — Development", content: "React.js component architecture with responsive CSS. Service listings, interactive plan comparison, and contact forms." },
      { title: "04 — Compliance", content: "Ensured regulatory compliance requirements for financial services websites in North East India." },
      { title: "05 — Delivery", content: "Live production website serving the retail financial community. Mobile-first, fully responsive." },
    ],
  },
];

export const experience = [
  {
    year: "Jan 2026 — May 2026",
    role: "Freelance Full Stack Developer",
    company: "Self-employed · Remote",
    description:
      "Developed and maintained production-grade client websites for Vulcan Insurance and Bhavisyad India. Resolved backend workflow issues, fixed admin panel bugs, and delivered responsive UI improvements across multiple live applications. Managed complete project lifecycle including client communication, deployment, and post-launch support.",
    tech: ["React.js", "JavaScript", "HTML", "CSS", "Node.js"],
  },
  {
    year: "Mar 2025 — Jul 2025",
    role: "Full Stack Developer",
    company: "The Entrepreneurship Network · Noida",
    description:
      "Developed a MERN Internship Portal connecting 500+ students with 50+ recruiters. Implemented JWT and OAuth2 authentication. Built production applications including TaskPilot, AI Quote Generator and TEN Media Academy. Improved frontend performance by 30% using lazy loading, API debouncing and React optimization.",
    tech: ["React.js", "Node.js", "MongoDB", "Express.js"],
  },
  {
    year: "Jan 2024 — Apr 2024",
    role: "Full Stack Developer Intern",
    company: "Business Web Solutions · New Delhi",
    description:
      "Developed 5+ responsive landing pages using React.js and TailwindCSS. Reduced page load time by 20%. Built a Google Keep clone using React and Redux. Integrated Socket.IO for real-time communication in a Pokémon Generator application.",
    tech: ["React.js", "Redux", "Socket.IO", "TailwindCSS"],
  },
];

export const skills = {
  frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML5 / CSS3",
    "TailwindCSS",
    "Bootstrap",
  ],
  backend: [
    "Node.js",
    "Express.js",
    "REST APIs",
    "Socket.IO",
    "JWT / OAuth2",
    "MongoDB",
    "Mongoose",
  ],
  tools: [
    "Git / GitHub",
    "Postman",
    "Figma",
    "Vercel / Render",
    "Multer",
    "Nodemailer",
    "Google Gemini API",
  ],
};

export const principles = [
  {
    num: "01",
    word: "Performance",
    desc: "Code that feels fast isn't an accident. I optimize from the start — lazy loading, debouncing, memoization, and lean bundle sizes.",
  },
  {
    num: "02",
    word: "Clarity",
    desc: "Complex systems deserve simple interfaces. Every UI decision should reduce cognitive load, not add to it.",
  },
  {
    num: "03",
    word: "Systems",
    desc: "I think in components, not one-offs. Scalable architecture means the tenth feature is as clean as the first.",
  },
  {
    num: "04",
    word: "Detail",
    desc: "The difference between good and great is in the details. Hover states, loading feedback, error messages — they all matter.",
  },
  {
    num: "05",
    word: "Ownership",
    desc: "I treat every project like it's mine — from initial requirements to post-launch support. Full accountability.",
  },
  {
    num: "06",
    word: "Curiosity",
    desc: "The field moves fast. I stay current through building, experimenting, and shipping — not just reading.",
  },
];

export const marqueeItems = [
  "FULL STACK", "REACT", "NODE.JS", "MONGODB", "REST APIs",
  "NEXT.JS", "TYPESCRIPT", "SOCKET.IO", "AI INTEGRATION", "UI/UX",
  "VERCEL", "FIGMA", "PERFORMANCE", "CLEAN CODE", "OPEN TO WORK",
];
