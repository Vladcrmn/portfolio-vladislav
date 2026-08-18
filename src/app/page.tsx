import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Education from "@/components/Education";
import LearningNow from "@/components/LearningNow";
import QuoteOfTheDay from "@/components/QuoteOfTheDay";
import AcademicJourney from "@/components/AcademicJourney";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <Navbar />

      <main>
        <Hero />
        <About />
        <QuoteOfTheDay />
        <Education />
        <LearningNow />
        <Projects />
        <AcademicJourney />
        <Skills />
        <Contact />
      </main>
    </div>
  );
}