// src/lib/data.ts

export const siteConfig = {
  name: "Shubham Rathod",
  role: "AI Engineer",
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
    title: "EcoSystem AI",
    category: "AI & Automation",
    description: "An intelligent multi-agent orchestration platform that automates the entire content lifecycle—from semantic trend analysis to cross-platform deployment.",
    metrics: ["10K+ automated cycles", "95% semantic relevance"],
    image: "/assets/images/social-media.png",
    tags: ["Next.js", "Python", "OpenAI", "n8n"],
    architecture: "Stateful Agentic Workflows",
    stack: "GPT-4 / Next.js / PostgreSQL",
    latency: "< 1.2s generation",
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: true,
  },
  {
    id: "football-performance-ai",
    title: "PitchPulse AI",
    category: "Machine Learning",
    description: "Predictive analytics engine for elite football performance, utilizing deep spatial-temporal data to forecast player impact and match outcomes.",
    metrics: ["88% predictive accuracy", "Per-second telemetry"],
    image: "/assets/images/football-ai.png",
    tags: ["Python", "Scikit-Learn", "FastAPI"],
    architecture: "Temporal Convolutional Nets",
    stack: "XGBoost / FastAPI / Docker",
    latency: "< 45ms inference",
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: true,
  },
  {
    id: "crypto-sentiment",
    title: "MarketBrain AI",
    category: "AI / Finance",
    description: "Real-time volatility forecasting platform leveraging high-frequency NLP to quantify market sentiment across decentralized exchanges.",
    metrics: ["1M+ tokens indexed", "Live Sentiment Stream"],
    image: "/assets/images/crypto-sentiment.png",
    tags: ["Node.js", "FinBERT", "FastAPI"],
    architecture: "Distributed NLP Pipeline",
    stack: "PyTorch / Redis / Node.js",
    latency: "Real-time WebSocket",
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: false,
  },
  {
    id: "encrypted-file-sharing",
    title: "OmniSafe P2P",
    category: "Security",
    description: "Enterprise-grade decentralized file sharing protocol featuring end-to-end AES-256-GCM encryption and ephemeral metadata handling.",
    metrics: ["AES-256-GCM Secure", "Zero-Knowledge Architecture"],
    image: "/assets/images/encrypted-sharing.png",
    tags: ["React", "Express", "MongoDB", "WebCrypto"],
    architecture: "E2EE + Ephemeral Storage",
    stack: "TypeScript / Node.js / AWS",
    latency: "Instant P2P Handshake",
    github: "https://github.com/Rathod-shubhamm",
    live: "#",
    featured: false,
  },
  {
    id: "ai-course-generator",
    title: "Lumina AI",
    category: "AI & Education",
    description: "A generative educational platform that architecturally constructs comprehensive curricula and interactive modules using RAG-enhanced LLMs.",
    metrics: ["Auto-Curriculum Generation", "RAG-driven Accuracy"],
    image: "/assets/images/course-generator.png",
    tags: ["Next.js", "LangChain", "VectorDB"],
    architecture: "Recursive RAG + Tree-of-Thought",
    stack: "Claude-3 / Pinecone / Next.js",
    latency: "< 4s per module",
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
    role: "AI Engineer Intern",
    period: "2023 - Present",
    description: "Developing intelligent agents and implementing RAG pipelines for enterprise clients.",
    achievements: ["Optimized retrieval accuracy by 25%", "Built autonomous agents using LangChain"],
  },
  {
    company: "BlinkCare",
    role: "Technical Advisor & Consultant",
    period: "Late 2025 - Present",
    description: "Served as an independent technical consultant for BlinkCare (blinkcare.co.in), a healthcare-focused startup. Advised on tech stack selection, system architecture, and business strategy to help lay the foundation for a scalable product.",
    achievements: [
      "Guided tech stack selection & architecture decisions",
      "Advised on product strategy and go-to-market approach",
      "Supported early-stage platform setup and infrastructure planning",
    ],
  },
  {
    company: "University of Technology",
    role: "Computer Science Graduate",
    period: "2021 - 2026",
    description: "Focused on AI/ML research and software engineering principles.",
    achievements: ["Class representative", "Developed 5+ major projects"],
  },
];
