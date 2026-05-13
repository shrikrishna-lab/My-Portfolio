import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ArrowRight, ChevronDown, Award } from 'lucide-react';
import { useRef } from 'react';

export default function Hero() {
    const profile = useStore((state) => state.profile);
    const loading = useStore((state) => state.loading);

    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

    if (loading || !profile) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-transparent">
                <div className="w-12 h-12 rounded-[16px] border-4 border-[#18112E]/10 border-t-[#FFB800] animate-spin" />
            </section>
        );
    }

    return (
        <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent pt-32 pb-20">
            <motion.div
                style={{ y, opacity }}
                className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-center text-center"
            >
                {/* Top Badge */}
                <div className="flex items-center gap-3 mb-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 150, damping: 18 }}
                        className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-[16px] border border-[#18112E] shadow-[4px_4px_0_#18112E]"
                    >
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FFB800] animate-pulse shadow-[0_0_10px_rgba(255,184,0,0.5)]" />
                        <span className="text-sm font-bold tracking-widest text-[#18112E] uppercase">{profile.title}</span>
                    </motion.div>
                </div>

                {/* Main Headline */}
                <motion.h1
                    className="text-6xl sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter text-[#18112E] max-w-7xl leading-[0.85] uppercase"
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.15 }}
                >
                    Creative <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#ffcc33]">
                        Developer.
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    className="mt-14 text-lg sm:text-2xl text-neutral-500 max-w-3xl mx-auto leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                >
                    {profile.intro}
                </motion.p>

                {/* CTAs */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center gap-6 mt-16 w-full justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.45 }}
                >
                    <motion.a
                        href="#projects"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="group relative flex items-center justify-center gap-3 bg-[#FFB800] text-[#18112E] px-10 py-5 rounded-[20px] font-extrabold uppercase tracking-wide transition-colors duration-300 w-full sm:w-auto shadow-[4px_4px_0_#18112E] hover:shadow-[8px_8px_0_#18112E]"
                    >
                        <span>View Work</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                    <motion.a
                        href="#contact"
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center justify-center px-10 py-5 rounded-[20px] font-extrabold uppercase tracking-wide bg-white border-2 border-[#18112E] text-[#18112E] shadow-[4px_4px_0_#18112E] hover:shadow-[8px_8px_0_#18112E] transition-all duration-300 w-full sm:w-auto"
                    >
                        Contact Me
                    </motion.a>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1, yoyo: Infinity }}
                >
                    <div className="w-8 h-12 rounded-full border-2 border-neutral-300 flex justify-center p-1">
                        <div className="w-1.5 h-3 bg-neutral-400 rounded-full animate-bounce" />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
