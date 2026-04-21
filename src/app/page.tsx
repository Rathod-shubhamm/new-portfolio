import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TechStack from "@/components/TechStack";
import Projects from "@/components/Projects";
import ProcessFlow from "@/components/ProcessFlow";
import Timeline from "@/components/Timeline";
import ParallaxText from "@/components/ParallaxText";
import Footer from "@/components/Footer";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Global ambient 3D background — lazy loaded */}
      <ThreeBackground />
      <Navbar />

      <div id="hero">
        <Hero />
      </div>

      <div id="about">
        <About />
      </div>

      <div id="skills">
        <TechStack />
      </div>

      <ParallaxText baseVelocity={-2} className="text-[12vw] opacity-5 text-white/10 pointer-events-none my-12">
        INTELLIGENCE • AUTONOMY • REASONING
      </ParallaxText>

      <div id="projects">
        <Projects />
      </div>

      <ParallaxText baseVelocity={2} className="text-[12vw] opacity-5 text-white/10 pointer-events-none my-12">
        INFERENCE • DEPLOYMENT • OPTIMIZATION
      </ParallaxText>

      <div id="process">
        <ProcessFlow />
      </div>

      <div id="experience">
        <Timeline />
      </div>

      <div id="contact">
        <Footer />
      </div>
    </main>
  );
}
