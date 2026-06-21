import { useRef, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useStore } from '@/lib/store';
import { ArrowRight } from 'lucide-react';

const GRADIENT_TERRA = 'from-[#d4744a]/20 via-[#d4744a]/5 to-transparent';
const TERRA_GLOW = 'rgba(212, 116, 74, 0.15)';

function AmbientBackground() {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const blur = isMobile ? 'blur-[60px]' : 'blur-[150px]';
    const blur2 = isMobile ? 'blur-[50px]' : 'blur-[120px]';
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-[#070707]" />
            <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br ${GRADIENT_TERRA} rounded-full ${blur}`} />
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#d4744a]/10 to-transparent rounded-full ${blur2}`} />
            <div className="absolute top-1/3 right-0 w-[300px] h-[600px] bg-gradient-to-b from-[#d4744a]/5 to-transparent rounded-full blur-[60px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#070707_70%)]" />
        </div>
    );
}

function GrainOverlay() {
    return (
        <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.035] mix-blend-overlay" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
        }} />
    );
}

function VignetteOverlay() {
    return (
        <div className="fixed inset-0 z-[2] pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(7,7,7,0.6) 80%, rgba(7,7,7,0.9) 100%)',
        }} />
    );
}

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 20;
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() * 2 + 1}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${6 + Math.random() * 6}s`,
}));

function ParticleField() {
    return (
        <div className="fixed inset-0 z-[3] pointer-events-none overflow-hidden">
            {PARTICLES.map((p, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-[#d4744a] opacity-20"
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.size,
                        height: p.size,
                        animation: `twinkle ${p.duration} ease-in-out ${p.delay} infinite`,
                    }}
                />
            ))}
        </div>
    );
}

function CharacterPortrait({ imageUrl, mouseX, mouseY, scrollProgress }) {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const mouseFactor = isMobile ? 2 : 6;

    const totalRotateX = useMotionValue(0);
    const totalRotateY = useMotionValue(0);
    const smoothX = useSpring(totalRotateX, { stiffness: 100, damping: 35 });
    const smoothY = useSpring(totalRotateY, { stiffness: 100, damping: 35 });

    const scrollTranslateZ = useTransform(scrollProgress, [0, 0.25], [0, -80]);

    const glowIntensity = useTransform(scrollProgress, [0, 0.3], [0.6, 1]);
    const glowRim = useTransform(glowIntensity, v => v * 0.5);
    const mouseXOffset = useTransform(mouseX, v => v * 12);
    const mouseYOffset = useTransform(mouseY, v => v * 12);
    const mouseXN2 = useTransform(mouseX, v => v * -3);
    const mouseY3 = useTransform(mouseY, v => v * 4);
    const mouseX5 = useTransform(mouseX, v => v * 6);

    const portraitScale = useTransform(scrollProgress, [0, 0.35], [1, isMobile ? 0.95 : 0.85]);
    const portraitY = useTransform(scrollProgress, [0, 0.35], [0, isMobile ? 40 : 80]);
    const glowScale = useTransform(scrollProgress, [0, 0.3], [1, 1.4]);

    // Single update loop: combines mouse + scroll contributions, outputs to totalRotate
    useEffect(() => {
        let raf = null;
        const update = () => {
            const mx = mouseX.get() * mouseFactor;
            const my = mouseY.get() * mouseFactor;
            const sv = Math.min(scrollProgress.get() / 0.25, 1);
            const sx = sv * 6;
            const sy = sv * -12;
            totalRotateX.set(my + sx);
            totalRotateY.set(-mx + sy);
            raf = null;
        };
        const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
        const ux = mouseX.on('change', schedule);
        const uy = mouseY.on('change', schedule);
        const us = scrollProgress.on('change', schedule);
        update();
        return () => { ux(); uy(); us(); if (raf) cancelAnimationFrame(raf); };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: 1200 }}>
            <motion.div className="relative w-[320px] h-[380px] md:w-[420px] md:h-[500px]" style={{ scale: portraitScale, y: portraitY, willChange: 'transform' }}>
                <motion.div className="absolute inset-0 gpu" style={{ rotateX: smoothX, rotateY: smoothY, transformStyle: 'preserve-3d', z: scrollTranslateZ }}>
                    <motion.div className="absolute -inset-16 md:-inset-20 rounded-full bg-[#d4744a]/10 blur-[60px] md:blur-[100px]" style={{ z: -60, scale: glowScale, opacity: glowIntensity }}
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div className="absolute -inset-8 md:-inset-10 rounded-full bg-gradient-to-br from-[#d4744a]/15 to-transparent blur-[50px] md:blur-[80px]" style={{ z: -30, x: mouseXOffset, y: mouseYOffset, opacity: glowIntensity }} />

                    <motion.div className="absolute inset-0 overflow-hidden rounded-2xl" style={{ z: 0 }}
                        animate={!isMobile ? { y: [0, -3, 0] } : {}} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-transparent to-transparent z-10 pointer-events-none" style={{ opacity: 0.4 }} />
                        <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-[5]" referrerPolicy="no-referrer" />
                        <motion.div className="absolute inset-0 z-[6] pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(212,116,74,0.1) 0%, transparent 50%, rgba(212,116,74,0.05) 100%)', opacity: glowIntensity }} />
                        <motion.div className="absolute top-0 left-0 right-0 h-[35%] z-[7] pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(212,116,74,0.15) 0%, transparent 100%)', opacity: glowRim, rotateX: mouseXN2 }} />
                        <motion.div className="absolute bottom-0 left-0 right-0 h-[25%] z-[4] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(7,7,7,0.7) 0%, transparent 100%)', y: mouseY3 }} />
                    </motion.div>

                    <motion.div className="absolute -bottom-6 left-[5%] right-[5%] h-[40px] z-[3] pointer-events-none" style={{ z: -20, background: 'radial-gradient(ellipse at center, rgba(212,116,74,0.25) 0%, transparent 70%)', scaleY: 0.6, opacity: glowIntensity, y: mouseX5 }}
                        animate={{ scaleX: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <motion.div className="absolute -inset-1 z-[8] pointer-events-none rounded-2xl" style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(212,116,74,0.08) 0%, transparent 50%)' }} />

                    <motion.div className="absolute inset-0 z-[9] pointer-events-none rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(212,116,74,0.02) 100%)' }}
                        animate={{ opacity: [0.3, 0.45, 0.3] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                </motion.div>
            </motion.div>
        </div>
    );
}

function ScrollIndicator({ scrollProgress }) {
    const opacity = useTransform(scrollProgress, [0, 0.08], [1, 0]);
    const y = useTransform(scrollProgress, [0, 0.08], [0, 20]);

    return (
        <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
            style={{ opacity, y }}
        >
            <span className="text-[10px] font-medium text-white/20 uppercase tracking-[0.25em]">Scroll</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#d4744a]/40 to-transparent">
                <motion.div
                    className="w-full h-3 bg-[#d4744a] rounded-full"
                    animate={{ y: [0, 36, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>
        </motion.div>
    );
}

function CinematicText({ profile, mouseY }) {
    const titleY = useTransform(mouseY, v => v * -3);

    return (
        <div className="relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            >
                <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 rounded-full border border-[#d4744a]/20 bg-[#d4744a]/5 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#d4744a] shadow-[0_0_8px_rgba(212,116,74,0.6)]" />
                    <span className="text-xs font-medium text-[#d4744a]/70 tracking-[0.2em]">
                        {profile.title || 'Creative Developer'}
                    </span>
                </div>
            </motion.div>

            <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.92]"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            >
                <span className="text-white drop-shadow-[0_2px_20px_rgba(10,255,140,0.1)]">{profile.name}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4744a] via-[#d4744a]/80 to-[#d4744a]/40">
                    Build. Ship.
                </span>
                <br />
                <span className="text-white/30">Repeat.</span>
            </motion.h1>

            <motion.p
                className="mt-8 text-base md:text-lg text-white/40 max-w-xl leading-relaxed font-light tracking-wide"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
                style={{ y: titleY }}
            >
                {profile.intro}
            </motion.p>

            <motion.div
                className="flex flex-col sm:flex-row items-start gap-4 mt-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
            >
                <motion.a
                    href="#projects"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex items-center gap-3 bg-[#d4744a] text-[#070707] px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10">View Work</span>
                    <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    <motion.div
                        className="absolute inset-0 bg-white"
                        initial={{ scaleX: 0, originX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                </motion.a>
                <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group flex items-center gap-2 px-8 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-all duration-300 font-medium"
                >
                    Get in touch
                </motion.a>
            </motion.div>
        </div>
    );
}

export default function CinematicHero() {
    const profile = useStore(s => s.profile);
    const loading = useStore(s => s.loading);
    const sectionRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 80, damping: 25 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 80, damping: 25 });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    });

    const smoothScrollProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

    const handleMouseMove = useCallback((e) => {
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    const handleTouchMove = useCallback((e) => {
        const t = e.touches[0];
        if (!t) return;
        const rect = sectionRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = (t.clientX - rect.left) / rect.width - 0.5;
        const y = (t.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(x);
        mouseY.set(y);
    }, [mouseX, mouseY]);

    const heroOpacity = useTransform(smoothScrollProgress, [0, 0.15], [1, 0]);
    const contentY = useTransform(smoothScrollProgress, [0, 0.15], [0, -40]);

    if (loading || !profile) {
        return (
            <section className="min-h-screen flex items-center justify-center bg-[#070707]">
                <div className="w-12 h-12 rounded-full border-2 border-[#d4744a]/20 border-t-[#d4744a] animate-spin" />
            </section>
        );
    }

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative min-h-screen flex items-center overflow-hidden bg-[#070707] select-none touch-pan-y"
        >
            <AmbientBackground />
            <GrainOverlay />
            <VignetteOverlay />

            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-20"
                style={{ opacity: heroOpacity, y: contentY }}
            >
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <div className="order-2 lg:order-1">
                        <CinematicText profile={profile} mouseY={smoothMouseY} />
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                        {profile.characterImage && (
                            <CharacterPortrait
                                imageUrl={profile.characterImage}
                                mouseX={smoothMouseX}
                                mouseY={smoothMouseY}
                                scrollProgress={smoothScrollProgress}
                            />
                        )}
                    </div>
                </div>
            </motion.div>

            <ScrollIndicator scrollProgress={smoothScrollProgress} />
        </section>
    );
}
