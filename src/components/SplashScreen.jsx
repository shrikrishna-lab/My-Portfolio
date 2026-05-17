import { useEffect } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useStore } from '@/lib/store';

const stars = Array.from({ length: 250 }, () => ({
    x: Math.random() * 100, y: Math.random() * 100,
    s: Math.random() * 2.5 + 0.5,
    d: 2 + Math.random() * 5, delay: Math.random() * 6,
}));

export default function SplashScreen({ onFinish }) {
    useEffect(() => {
        const state = useStore.getState();
        const urls = [];
        if (state.profile?.characterImage) urls.push(state.profile.characterImage);
        state.projects?.forEach((p) => { if (p.imageUrl) urls.push(p.imageUrl); });
        urls.forEach((url) => { const img = new Image(); img.src = url; });
    }, []);

    useEffect(() => {
        const t1 = setTimeout(() => onFinish(), 2800);
        return () => clearTimeout(t1);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{ background: '#070707' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Atmosphere gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,116,74,0.03)_0%,transparent_60%)]" />

            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="g" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5"/></pattern></defs>
                <rect width="100%" height="100%" fill="url(#g)"/>
            </svg>

            {/* Falling stars */}
            {[
                { delay: 0.3, dur: 1.5, top: 3, left: 20 },
                { delay: 1.0, dur: 1.8, top: 12, left: 55 },
                { delay: 1.8, dur: 1.3, top: 8, left: 35 },
                { delay: 2.5, dur: 1.6, top: 18, left: 65 },
                { delay: 3.2, dur: 1.4, top: 5, left: 45 },
                { delay: 4.0, dur: 1.7, top: 15, left: 30 },
                { delay: 4.8, dur: 1.5, top: 10, left: 70 },
                { delay: 5.5, dur: 1.3, top: 22, left: 50 },
                { delay: 6.3, dur: 1.6, top: 7, left: 40 },
                { delay: 7.0, dur: 1.4, top: 14, left: 60 },
                { delay: 7.8, dur: 1.8, top: 20, left: 25 },
                { delay: 8.5, dur: 1.5, top: 4, left: 55 },
            ].map((f, i) => (
                <motion.div key={`f${i}`} className="absolute z-[1]"
                    style={{ top: `${f.top}%`, left: `${f.left}%` }}
                    animate={{
                        y: [0, 300],
                        x: [0, -60],
                        opacity: [0, 1, 1, 0],
                    }}
                    transition={{ duration: f.dur, repeat: Infinity, delay: f.delay, ease: 'easeOut' }}
                >
                    <div className="flex items-center" style={{ transform: 'rotate(-15deg)' }}>
                        <div className="w-[2px] h-[2px] rounded-full bg-white" />
                        <div className="w-12 h-px bg-gradient-to-l from-white/30 to-transparent" />
                    </div>
                </motion.div>
            ))}

            {/* Stars */}
            {stars.map((s, i) => (
                <motion.div key={i} className="absolute rounded-full bg-white z-[1]"
                    style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s }}
                    animate={{ opacity: [0.05, 0.7, 0.05], scale: [1, 1.4, 1] }}
                    transition={{ duration: s.d, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
                />
            ))}



            {/* Rings */}
            {[
                { d: 0, w: 0.8, c: 'rgba(212,116,74,0.3)', max: 200, dur: 2.2, t: 0 },
                { d: 0.35, w: 0.6, c: 'rgba(212,116,74,0.2)', max: 240, dur: 2.2, t: 4 },
                { d: 0.7, w: 0.5, c: 'rgba(212,116,74,0.12)', max: 280, dur: 2.2, t: -3 },
                { d: 1.05, w: 0.4, c: 'rgba(212,116,74,0.06)', max: 320, dur: 2.2, t: 6 },
                { d: 1.4, w: 0.3, c: 'rgba(212,116,74,0.03)', max: 360, dur: 2.2, t: -5 },
                { d: 2.2, w: 0.5, c: 'rgba(255,255,255,0.08)', max: 220, dur: 3.2, t: 2 },
                { d: 2.7, w: 0.3, c: 'rgba(255,255,255,0.04)', max: 280, dur: 3.2, t: -4 },
                { d: 3.2, w: 0.2, c: 'rgba(255,255,255,0.02)', max: 340, dur: 3.2, t: 3 },
            ].map((r, i) => (
                <motion.div key={i} className="absolute rounded-full z-[1]"
                    style={{ width: 5, height: 5, border: `${r.w}px solid ${r.c}`, transform: `rotate(${r.t}deg)`, transformStyle: 'preserve-3d' }}
                    animate={{ scale: [0, r.max], opacity: [1, 0] }}
                    transition={{ duration: r.dur, repeat: Infinity, delay: r.d, ease: 'easeOut' }}
                />
            ))}

            {/* Corners */}
            <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-white/8 rounded-tl" />
            <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-white/8 rounded-tr" />
            <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-white/8 rounded-bl" />
            <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-white/8 rounded-br" />

            {/* Content */}
            <motion.div className="relative flex flex-col items-center"
                animate={{ scale: [1, 3], opacity: [1, 0] }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.4 }}
            >
                {/* Image */}
                <motion.div className="relative w-20 h-20 mb-6"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], type: 'spring', stiffness: 100, damping: 12 }}
                >
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-xl">
                        <img src="/portfolio%20image2.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <motion.div className="absolute -inset-2 rounded-full border border-white/10"
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div className="absolute -inset-4 rounded-full border border-white/5"
                        animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    />
                </motion.div>

                {/* Name */}
                <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center tracking-tight"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ fontFamily: "'Bagind', 'Space Grotesk', 'Inter', sans-serif" }}
                >
                    Shrikrishna
                </motion.h1>

                {/* Tagline */}
                <motion.div className="flex items-center gap-3 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                >
                    <span className="w-5 h-px bg-white/10" />
                    <span className="text-[10px] text-white/20 font-medium tracking-[0.3em] uppercase">Creative Developer</span>
                    <span className="w-5 h-px bg-white/10" />
                </motion.div>
            </motion.div>

            {/* Loading */}
            <motion.div className="absolute bottom-16 flex items-center gap-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                {[0, 1, 2].map((i) => (
                    <motion.span key={i}
                        className="w-1 h-1 rounded-full bg-[#d4744a]/40"
                        animate={{ scale: [1, 1.6, 1], opacity: [0.2, 0.7, 0.2] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
