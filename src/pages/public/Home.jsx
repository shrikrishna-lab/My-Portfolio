import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import Projects from '@/components/public/Projects';
import StartupVision from '@/components/public/StartupVision';
import Achievements from '@/components/public/Achievements';
import Contact from '@/components/public/Contact';
import Footer from '@/components/public/Footer';
import { useStore } from '@/lib/store';

export default function Home() {
    const profile = useStore((s) => s.profile);
    const projects = useStore((s) => s.projects) || [];

    const personSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Person",
                "@id": "https://shrikrishna-intro.vercel.app/#person",
                "name": profile?.name || "Shrikrishna Handibag",
                "url": "https://shrikrishna-intro.vercel.app/",
                "image": "https://shrikrishna-intro.vercel.app/my_profile_photo.png",
                "sameAs": [
                    "https://www.linkedin.com/in/shrikrishna-handibag/",
                    "https://github.com/shrikrishna-lab",
                    "https://instagram.com/krrish_h_77"
                ],
                "jobTitle": profile?.title || "Web Developer & Open Source Contributor",
                "description": profile?.intro || "IT Engineering student and Web Developer from Pune, India.",
                "knowsAbout": ["React", "Java", "Python", "SQL", "Open Source", "Software Engineering"],
                "memberOf": {
                    "@type": "Organization",
                    "name": "Error404 Studio",
                    "url": "https://github.com/error404-studio"
                }
            },
            {
                "@type": "WebSite",
                "@id": "https://shrikrishna-intro.vercel.app/#website",
                "url": "https://shrikrishna-intro.vercel.app/",
                "name": `${profile?.name || "Shrikrishna Handibag"} | Portfolio`,
                "description": profile?.intro || "Explore projects, skills, achievements, and open-source contributions of Shrikrishna Handibag.",
                "publisher": { "@id": "https://shrikrishna-intro.vercel.app/#person" }
            },
            {
                "@type": "ProfilePage",
                "@id": "https://shrikrishna-intro.vercel.app/#profilepage",
                "url": "https://shrikrishna-intro.vercel.app/",
                "name": `${profile?.name || "Shrikrishna Handibag"} Professional Profile`,
                "about": { "@id": "https://shrikrishna-intro.vercel.app/#person" },
                "mainEntity": { "@id": "https://shrikrishna-intro.vercel.app/#person" }
            }
        ]
    };

    const projectsListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "numberOfItems": projects.length,
        "itemListElement": projects.map((p, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "item": {
                "@type": "SoftwareSourceCode",
                "name": p.title,
                "description": p.description,
                "codeRepository": p.githubUrl || "https://github.com/shrikrishna-lab",
                "runtimePlatform": p.techStack || "React",
                "image": p.imageUrl || "https://shrikrishna-intro.vercel.app/portfolio%20image2.png"
            }
        }))
    };

    return (
        <div className="flex flex-col gap-24 md:gap-32 w-full pt-16">
            {/* React 19 Document Metadata Hoisting */}
            <title>{profile?.name ? `${profile.name} | Portfolio - IT Engineering Student & Web Developer` : 'Shrikrishna Handibag | Portfolio'}</title>
            <meta name="description" content="Explore Shrikrishna Handibag's official developer portfolio. Pune IT student, React developer, open-source GSSoC contributor, and SaaS builder." />
            <meta name="keywords" content="Shrikrishna Handibag, Shrikrishna Handibag portfolio, IT Student Pune, Web Developer Pune, GSSoC 2026, Java Python Developer, DevConnect, PromptQuill, SaaS Builder" />
            <link rel="canonical" href="https://shrikrishna-intro.vercel.app/" />
            
            {/* Open Graph Tags */}
            <meta property="og:title" content={`${profile?.name || 'Shrikrishna Handibag'} | Portfolio - IT Engineering Student`} />
            <meta property="og:description" content="Explore full-stack projects, open-source GSSoC 2026 contributions, and Oracle/IIT achievements." />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://shrikrishna-intro.vercel.app/" />
            <meta property="og:image" content="https://shrikrishna-intro.vercel.app/my_profile_photo.png" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:title" content={`${profile?.name || 'Shrikrishna Handibag'} | Portfolio - IT Engineering Student`} />
            <meta name="twitter:description" content="Explore full-stack projects, open-source GSSoC 2026 contributions, and Oracle/IIT achievements." />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content="https://shrikrishna-intro.vercel.app/my_profile_photo.png" />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(personSchema)}
            </script>
            {projects.length > 0 && (
                <script type="application/ld+json">
                    {JSON.stringify(projectsListSchema)}
                </script>
            )}

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
