import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import StartupVision from '@/components/public/StartupVision';
import Achievements from '@/components/public/Achievements';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';

export default function Home() {
    return (
        <div className="flex flex-col gap-24 md:gap-32 w-full pt-16">
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <StartupVision />
            <Achievements />
            <Contact />
            <Footer />
        </div>
    );
}
