import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';

export default function About() {
    const profile = useStore((state) => state.profile);

    if (!profile) return null;

    return (
        <section id="about" className="py-32 px-4 bg-white relative z-10 overflow-hidden border-t border-neutral-100">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFB800]/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-10 h-1 bg-[#FFB800] rounded-full" />
                        <span className="text-[#FFB800] font-extrabold tracking-widest text-sm uppercase">About The Creator</span>
                    </div>

                    <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-black text-[#18112E] tracking-tighter uppercase leading-[0.9] mb-20">
                        The Story <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-300">So Far.</span>
                    </h2>

                    <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
                        <div className="lg:col-span-7">
                            <h3 className="text-3xl font-extrabold text-[#18112E] mb-8 flex items-center gap-3">
                                Background
                            </h3>
                            <div className="space-y-6 text-neutral-600 text-xl leading-relaxed font-medium bg-[#F8F9FA] p-8 rounded-[32px] border border-neutral-100 shadow-sm">
                                <p>{profile.aboutStory}</p>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <h3 className="text-3xl font-extrabold text-[#18112E] mb-10">Timeline</h3>
                            <div className="relative border-l-2 border-neutral-200 space-y-16 pl-12 bg-white rounded-[32px] p-8 border shadow-sm">
                                <div className="relative">
                                    <div className="absolute -left-[58px] top-1.5 w-5 h-5 bg-[#FFB800] rounded-full shadow-[0_0_15px_rgba(255,184,0,0.5)] border-4 border-white" />
                                    <h4 className="text-2xl font-extrabold text-[#18112E] mb-3 tracking-tight">Present</h4>
                                    <p className="text-neutral-500 font-bold leading-relaxed">Building Startups & Learning Advanced Web Dev</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[58px] top-1.5 w-5 h-5 bg-neutral-300 rounded-full border-4 border-white" />
                                    <h4 className="text-2xl font-extrabold text-neutral-400 mb-3 tracking-tight">2024</h4>
                                    <p className="text-neutral-500 font-bold leading-relaxed">Mastered React & Started Freelancing</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[58px] top-1.5 w-5 h-5 bg-neutral-300 rounded-full border-4 border-white" />
                                    <h4 className="text-2xl font-extrabold text-neutral-400 mb-3 tracking-tight">2023</h4>
                                    <p className="text-neutral-500 font-bold leading-relaxed">Enrolled in IT Degree & Learned Fundamentals</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
