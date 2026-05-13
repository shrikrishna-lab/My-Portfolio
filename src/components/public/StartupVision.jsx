import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Rocket, Users, Zap, Globe } from 'lucide-react';

export default function StartupVision() {
    const profile = useStore((state) => state.profile);

    if (!profile) return null;

    const pillars = [
        { icon: Users, title: 'Connect', desc: 'Link developers with students and companies in a unified ecosystem.' },
        { icon: Zap, title: 'Build', desc: 'Collaborate on real-world projects and accelerate hackathon ideas.' },
        { icon: Globe, title: 'Scale', desc: 'Transition seamlessly from initial concept to production-ready MVP.' },
    ];

    return (
        <section id="startup" className="py-32 px-4 relative overflow-hidden bg-white border-t-2 border-[#18112E]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FFB800]/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="text-center mb-20"
                >
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <span className="w-10 h-1 bg-[#18112E]" />
                        <span className="text-[#18112E] font-extrabold tracking-wider text-sm uppercase flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-[#FFB800]" /> The Vision
                        </span>
                        <span className="w-10 h-1 bg-[#18112E]" />
                    </div>

                    <h2 className="text-5xl md:text-8xl font-black text-[#18112E] tracking-tighter uppercase leading-[0.9] mb-8">
                        DevConnect <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#ffcc33]">Platform.</span>
                    </h2>

                    <p className="text-neutral-500 text-xl max-w-3xl mx-auto leading-relaxed font-bold">
                        {profile.startupVision}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {pillars.map((pillar, i) => (
                        <motion.div
                            key={pillar.title}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 20 }}
                            className="bg-[#F8F9FA] border-2 border-[#18112E] shadow-[6px_6px_0_#18112E] rounded-[32px] p-8 hover:bg-[#FFB800] transition-colors group relative overflow-hidden cursor-default"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                            <div className="w-16 h-16 mb-6 rounded-2xl bg-white border-2 border-[#18112E] flex items-center justify-center shadow-[4px_4px_0_#18112E] group-hover:bg-[#18112E] transition-colors relative z-10">
                                <pillar.icon className="w-8 h-8 text-[#18112E] group-hover:text-[#FFB800] transition-colors" />
                            </div>

                            <h3 className="text-3xl font-black text-[#18112E] mb-3 tracking-tight group-hover:text-[#18112E] transition-colors relative z-10">
                                {pillar.title}
                            </h3>

                            <p className="text-neutral-600 font-bold leading-relaxed relative z-10 group-hover:text-[#18112E] transition-colors">
                                {pillar.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
