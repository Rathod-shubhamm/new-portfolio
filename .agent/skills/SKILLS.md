# SKILL: World-Class AI Engineer Portfolio (Next.js)

---

## PURPOSE
Build a visually extraordinary, production-grade personal portfolio website for an AI engineer using **Next.js 14+ (App Router)**. This is not a template — every choice must feel crafted, intentional, and deeply tied to the identity of someone who builds intelligent systems. The result must be the kind of portfolio that makes a senior recruiter or fellow engineer stop scrolling.

---

## TECH STACK (MANDATORY)

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, routing, image optimization |
| Styling | Tailwind CSS + CSS Variables | Rapid utility, consistent theming |
| Animations | **Framer Motion** (primary) | Scroll, entrance, gesture animations |
| 3D / Canvas | **Three.js** or **React Three Fiber** | Hero section depth, background effects |
| Icons | Lucide React + custom SVGs | Clean, consistent iconography |
| Fonts | Google Fonts or next/font | Distinctive display + body pairing |
| Scroll Effects | Framer Motion `useScroll` + `useTransform` | Parallax, sticky reveals |
| Cursor | Custom CSS / JS cursor | Premium feel |

---

## DESIGN PHILOSOPHY

### Aesthetic Direction: **"Dark Intelligence"**
Think: the aesthetic of a machine that thinks. Not sci-fi cliché — more like the UI of a Bloomberg terminal crossed with a high-end design agency.

- **Dark base** (#050508 or #0a0a0f) — not flat black, near-black with a subtle blue/indigo undertone
- **Sharp accent** — electric indigo `#6366f1`, neon cyan `#22d3ee`, or acid green `#84cc16` — pick ONE and own it
- **Secondary text** — muted slate `#94a3b8`
- **Cards** — glassy, semi-transparent `rgba(255,255,255,0.04)` with `backdrop-filter: blur(12px)` and subtle borders `rgba(255,255,255,0.08)`
- **Gradients** — radial glows, not linear fills. Glow should bleed from accent color subtly in hero

### Typography (CRITICAL — do not use Inter or Roboto)
- **Display / Hero** heading: `Syne`, `Bebas Neue`, `Space Grotesk` (only if paired unexpectedly), or `Neue Haas Grotesk`  
- **Body**: `DM Sans`, `Instrument Sans`, or `Geist`
- **Code / Mono accents**: `JetBrains Mono` or `Fira Code` for tech labels, terminal text
- Headings should feel BOLD and spatial — large tracking, high contrast

### Visual Signature (make ONE of these the unforgettable element)
Pick the hero signature:
- Option A: **Animated neural network graph** (Three.js, nodes + edges pulsing) as hero background
- Option B: **ASCII/typewriter terminal** that "types" the bio in real time with a blinking cursor
- Option C: **3D floating tech sphere** (React Three Fiber) with orbiting skill logos
- Option D: **Particle field** that reacts to mouse movement (Three.js / tsParticles)

---

## PAGE STRUCTURE & SECTIONS

### 1. `Hero Section`
- Full viewport height (`100vh`)
- Name in massive display font — stagger-animate letter by letter using Framer Motion
- Title animates in second: "AI Engineer · LLM Systems · ML Infrastructure" (typewriter or fade-up)
- One-liner about building intelligent systems
- CTA buttons: "View Work" + "Download Resume" — glassmorphism style with hover glow
- **Floating visual signature** (see options above) on right side or as background
- Scroll indicator: animated downward arrow or scroll line

**Code Pattern:**
```jsx
// app/components/Hero.tsx
"use client"
import { motion } from "framer-motion"

const letterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
}

export function Hero({ name }: { name: string }) {
  return (
    <section className="relative h-screen flex items-center">
      <div className="container">
        <h1 className="text-8xl font-display font-bold tracking-tighter">
          {name.split("").map((char, i) => (
            <motion.span key={i} custom={i} variants={letterVariants}
              initial="hidden" animate="visible" className="inline-block">
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>
      </div>
    </section>
  )
}
```

---

### 2. `About / Bio Section`
- Split layout: left = short punchy bio, right = animated skill bar or radar chart
- Reveal on scroll using Framer Motion `whileInView`
- Highlight key numbers: years of experience, models deployed, papers, open source stars
- Stats animate counting up when they enter viewport (CountUp animation)
- Photo if available: circular with glowing ring border, subtle float animation

**Scroll reveal pattern:**
```jsx
<motion.div
  initial={{ opacity: 0, y: 60 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
>
```

---

### 3. `Skills / Tech Stack Section`
DO NOT use boring progress bars. Use one of:
- **Option A: Bento grid** — irregular card grid, each card highlights a skill cluster with icon + hover glow
- **Option B: Floating badge cloud** — skills float at different Z-levels with parallax on scroll
- **Option C: Interactive skill wheel** — SVG/canvas diagram where clicking a skill expands details

Skills to organize into clusters for an AI engineer:
- LLMs & GenAI: GPT, Claude, Gemini, LangChain, LlamaIndex, RAG
- ML/DL: PyTorch, TensorFlow, HuggingFace, Scikit-learn
- MLOps: MLflow, Weights & Biases, Docker, Kubernetes, CI/CD
- Infra/Cloud: AWS, GCP, Azure, FastAPI, Ray
- Frontend: Next.js, React, TypeScript (supporting tools)

**Bento Grid Card:**
```jsx
// Each card has: icon, cluster name, skill pills, hover: lift + glow border
<motion.div
  whileHover={{ y: -8, boxShadow: "0 0 40px rgba(99,102,241,0.3)" }}
  className="rounded-2xl border border-white/8 bg-white/4 backdrop-blur-xl p-6"
>
```

---

### 4. `Projects Section` ← MOST IMPORTANT
Each project card must feel like a product showcase:

**Card anatomy:**
- Full-bleed image/video preview (use `next/image`)
- Overlay gradient: dark at bottom
- Project title + one-liner
- Tech tags (pill badges)
- Metrics (e.g., "98% accuracy", "10K daily users", "3x latency reduction")
- Links: GitHub + Live/Demo
- **Hover**: card lifts, image scales 1.05, overlay dims, metrics pop out

**Layout**: Masonry grid or alternating left/right large cards

```jsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ type: "spring", stiffness: 400, damping: 30 }}
  className="group relative overflow-hidden rounded-3xl cursor-pointer"
>
  <Image ... className="transition-transform duration-700 group-hover:scale-105" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
  {/* content */}
</motion.div>
```

**Filtering**: Add animated filter tabs (All / LLM / MLOps / Research) using Framer Motion `layout` for smooth reordering

---

### 5. `Experience / Timeline Section`
- Vertical timeline with glowing connector line
- Each entry slides in from alternating sides on scroll
- Company logo + role + duration + bullet achievements
- Use `useScroll` to animate the timeline line drawing downward

```jsx
// Animated timeline line
const { scrollYProgress } = useScroll({ target: containerRef })
const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

<motion.div style={{ scaleY, originY: 0 }}
  className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 to-transparent" />
```

---

### 6. `Publications / Research Section` (if applicable)
- Card grid with paper title, venue (NeurIPS, ICML, ArXiv), abstract excerpt
- Citation count badge
- ArXiv / PDF link with icon
- Hover: abstract expands smoothly

---

### 7. `Open Source / GitHub Activity Section`
- Show top repos as cards (via GitHub API or static data)
- GitHub contribution heatmap (use `react-github-calendar` or custom SVG)
- Star/fork counts animated on enter

---

### 8. `Testimonials / Recommendations Section`
- Horizontal infinite scroll carousel (no library needed, CSS animation)
- Cards: photo, name, role, quote, company
- Autoplay + pause on hover

```css
@keyframes scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.carousel { animation: scroll 30s linear infinite; }
.carousel:hover { animation-play-state: paused; }
```

---

### 9. `Contact Section`
- Split: left = contact form with floating labels, right = social links
- Form fields: Name, Email, Message — glass style inputs
- Submit button: magnetic hover effect (mouse attraction CSS/JS)
- Social icons: LinkedIn, GitHub, Twitter/X, HuggingFace, email
- Each social link: scale + glow on hover

**Magnetic button effect:**
```tsx
const handleMouseMove = (e: MouseEvent) => {
  const rect = btn.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  setPos({ x: x * 0.3, y: y * 0.3 })
}
```

---

### 10. `Footer`
- Minimal: name, tagline, current year, quick links
- Subtle gradient fade to very dark background
- "Made with Next.js + ☕" badge in corner

---

## GLOBAL EFFECTS & POLISH

### Custom Cursor
```css
* { cursor: none; }
.cursor {
  width: 12px; height: 12px;
  background: var(--accent);
  border-radius: 50%;
  position: fixed; pointer-events: none;
  transition: transform 0.15s ease, width 0.3s, height 0.3s;
  mix-blend-mode: difference;
}
.cursor.hovering { width: 40px; height: 40px; }
```

### Noise Texture Overlay
```css
body::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,..."); /* SVG noise */
  opacity: 0.03;
  pointer-events: none;
  z-index: 9999;
}
```

### Radial Glow Background
```css
.hero-glow {
  position: absolute;
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
```

### Smooth Scrolling
```tsx
// Use Lenis for buttery smooth scrolling
import Lenis from "@studio-freight/lenis"

useEffect(() => {
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
  const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return () => lenis.destroy()
}, [])
```

### Page Transition
- On route change: full-screen overlay slides in then out (Framer Motion `AnimatePresence`)

---

## NEXT.JS SPECIFIC PATTERNS

### App Router Structure
```
app/
├── layout.tsx          ← font loading, cursor, lenis, metadata
├── page.tsx            ← assembles all section components
├── components/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Skills.tsx
│   ├── Projects.tsx
│   ├── Timeline.tsx
│   ├── Contact.tsx
│   ├── Navbar.tsx      ← glassmorphism sticky nav
│   └── ui/             ← reusable: Button, Card, Badge, Tag
├── lib/
│   └── data.ts         ← ALL content (projects, skills, experience) as typed TS objects
└── styles/
    └── globals.css     ← CSS variables, keyframes, base styles
```

### Font Loading (next/font)
```tsx
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google"
const syne = Syne({ subsets: ["latin"], variable: "--font-display", weight: ["700", "800"] })
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-body" })
```

### Image Optimization
- Always use `next/image` with `fill` or explicit `width`/`height`
- Project screenshots: WebP format, `priority` on above-fold images

### Metadata / SEO
```tsx
export const metadata: Metadata = {
  title: "Your Name | AI Engineer",
  description: "...",
  openGraph: { images: ["/og-image.png"] },
  twitter: { card: "summary_large_image" }
}
```

---

## PERFORMANCE RULES
1. Use `"use client"` ONLY on components that need browser APIs or interactivity — rest is RSC
2. Lazy load heavy components: `dynamic(() => import("./HeroCanvas"), { ssr: false })`
3. All Framer Motion: use `viewport={{ once: true }}` to avoid re-triggering
4. Use `will-change: transform` sparingly on animated elements
5. Code-split Three.js: always dynamic import, never in server components

---

## CONTENT SCHEMA (data.ts)

```typescript
// lib/data.ts — Structure ALL content here
export const projects: Project[] = [
  {
    id: "rag-pipeline",
    title: "Enterprise RAG Pipeline",
    description: "...",
    tech: ["LangChain", "OpenAI", "Pinecone", "FastAPI"],
    metrics: ["10K daily users", "92% retrieval accuracy"],
    image: "/projects/rag.png",
    github: "https://...",
    demo: "https://...",
    category: "llm"
  }
]

export const skills: SkillCluster[] = [...]
export const experience: Experience[] = [...]
export const about: About = { bio: "...", stats: [...] }
```

---

## NAVBAR
- Sticky, starts transparent, gains glass blur + border on scroll
- Active section highlight using Intersection Observer
- Mobile: hamburger → full-screen overlay menu with staggered link animations
- Logo: name initials in accent color, custom font

---

## WHAT GEMINI MUST AVOID
- ❌ White/light backgrounds (use dark)
- ❌ Generic card designs with no depth
- ❌ Flat color buttons without glow/depth
- ❌ Static layouts with no scroll animation
- ❌ Inter or Roboto fonts
- ❌ Purple-on-white gradient (cliché AI aesthetic)
- ❌ Cookie-cutter layouts from Bootstrap
- ❌ Missing mobile responsiveness
- ❌ Using `<img>` instead of `next/image`
- ❌ Putting all code in one file — always componentize

---

## CHECKLIST BEFORE FINALIZING

- [ ] Hero has a visual signature (3D / particles / terminal)
- [ ] All sections animate on scroll with Framer Motion
- [ ] Cards have hover interactions (lift, glow, scale)
- [ ] Custom cursor implemented
- [ ] Lenis smooth scroll installed
- [ ] Dark theme with one accent color only
- [ ] Mobile responsive (all breakpoints)
- [ ] Fonts are distinctive (not Inter/Roboto)
- [ ] Noise texture overlay on body
- [ ] Page load: staggered section entrances
- [ ] Navbar becomes glass on scroll
- [ ] Projects have metrics, not just descriptions
- [ ] GitHub / LinkedIn / HuggingFace links present
- [ ] Metadata / OG tags set
- [ ] `next/image` used everywhere
- [ ] Heavy components dynamically imported

---

## EXAMPLE PROMPT TO USE WITH GEMINI

> "Using the SKILL above, build my portfolio in Next.js 14 (App Router). Use the following content: [paste your content here]. Make it dark-themed with an indigo accent. Use Syne for display headings, DM Sans for body. For the hero, use an animated particle field that reacts to mouse movement. Include a bento grid for skills, masonry grid for projects with filter tabs, vertical timeline for experience, and a glass contact form. Use Framer Motion throughout. Install Lenis smooth scroll. Make every section scroll-animated. I want this to look like it was built by a top-tier design agency."

---

*This skill was designed for building world-class AI engineer portfolios with Next.js. Every pattern in this document is production-tested and optimized for both aesthetics and performance.*s