// src/lib/data.ts

export const siteConfig = {
  name: "Shubham Rathod",
  role: "AI Context Engineer",
  tagline: "Bridging the gap between Complex Data and Intelligent Action.",
  email: "shubhamrathod1619@gmail.com",
  github: "https://github.com/Rathod-shubhamm",
  linkedin: "https://www.linkedin.com/in/shubham-rathod-821a01202",
  socials: [
    { name: "GitHub", href: "https://github.com/Rathod-shubhamm", platform: "github" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/shubham-rathod-821a01202", platform: "linkedin" },
    { name: "Email", href: "mailto:shubhamrathod1619@gmail.com", platform: "email" },
  ]
};

export const projects = [
  {
    id: "social-media-automation",
    title: "Social Media Automation",
    category: "AI & Automation",
    description: "AI-powered content platform that generates, schedules, and posts content across multiple social platforms using LLMs.",
    metrics: ["10K+ automated posts", "95% content relevance"],
    image: "/assets/images/project-1.png",
    tags: ["Next.js", "Python", "OpenAI"],
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: true,
  },
  {
    id: "football-performance-ai",
    title: "Football Performance AI",
    category: "Machine Learning",
    description: "ML platform predicting football player performance based on historical data and match analytics.",
    metrics: ["88% prediction accuracy", "Real-time match data"],
    image: "/assets/images/project-1.png",
    tags: ["Python", "Scikit-Learn", "PostgreSQL"],
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: true,
  },
  {
    id: "crypto-sentiment",
    title: "Crypto Sentiment Analysis",
    category: "AI / Finance",
    description: "Real-time news aggregation platform with AI-powered sentiment analysis for crypto market trends.",
    metrics: ["Live news feed", "Advanced NLP models"],
    image: "/assets/images/project-1.png",
    tags: ["Node.js", "NLP", "FastAPI"],
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: false,
  },
  {
    id: "encrypted-file-sharing",
    title: "Encrypted File Sharing",
    category: "Security",
    description: "Secure P2P file sharing system with end-to-end AES-256 encryption and self-destructing links.",
    metrics: ["AES-256 Encryption", "Self-destruct mechanism"],
    image: "/assets/images/project-1.png",
    tags: ["React", "Express", "MongoDB"],
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: false,
  },
  {
    id: "ai-course-generator",
    title: "AI E-Course Generator",
    category: "AI & Education",
    description: "End-to-end platform automating e-course creation, including curriculum design and content generation.",
    metrics: ["Auto-content creation", "Curriculum AI"],
    image: "/assets/images/project-1.png",
    tags: ["Next.js", "LLMs", "Node.js"],
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: true,
  },
];

export const skillClusters = [
  {
    title: "AI & Machine Learning",
    skills: ["Machine Learning", "RAG & AI Agents", "LangChain", "Vector Databases", "LLMs (GPT-4, Claude, Gemini)"],
    icon: "🧠",
  },
  {
    title: "Backend & Systems",
    skills: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Docker", "n8n"],
    icon: "⚙️",
  },
  {
    title: "Frontend Engineering",
    skills: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    icon: "⚛️",
  },
  {
    title: "Infrastructure & Cloud",
    skills: ["AWS", "GCP", "Vercel", "CI/CD", "Serverless"],
    icon: "☁️",
  },
];

export const experience = [
  {
    company: "Future AI Solutions",
    role: "AI Context Engineer Intern",
    period: "2023 - Present",
    description: "Developing intelligent agents and implementing RAG pipelines for enterprise clients.",
    achievements: ["Optimized retrieval accuracy by 25%", "Built autonomous agents using LangChain"],
  },
  {
    company: "University of Technology",
    role: "Computer Science Graduate",
    period: "2020 - 2024",
    description: "Focused on AI/ML research and software engineering principles.",
    achievements: ["Class representative", "Developed 5+ major projects"],
  },
];
