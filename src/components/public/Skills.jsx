import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import * as LucideIcons from 'lucide-react';

export default function Skills() {
    const skills = useStore((state) => state.skills);

    const frontendSkills = skills.filter((s) => s.category === 'Frontend');
    const backendSkills = skills.filter((s) => s.category === 'Backend');
    const otherSkills = skills.filter((s) => s.category !== 'Frontend' && s.category !== 'Backend');

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 30 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 150, damping: 18 } }
    };

    const SkillPill = ({ skill }) => {
        const IconComponent = LucideIcons[skill.icon] || LucideIcons.Code;
        return (
            <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 bg-[#F8F9FA] border-2 border-[#18112E] px-6 py-4 rounded-[20px] hover:bg-[#FFB800] transition-colors duration-300 cursor-default group shadow-[4px_4px_0_#18112E] hover:shadow-[8px_8px_0_#18112E]"
                whileHover={{ scale: 1.05, y: -3, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                whileTap={{ scale: 0.97 }}
            >
                <div className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center border border-neutral-100 group-hover:bg-[#FFB800] group-hover:border-[#FFB800] transition-colors duration-300 shadow-sm">
                    <IconComponent className="w-5 h-5 text-[#18112E] group-hover:text-white transition-colors" />
                </div>
                <span className="font-extrabold text-[#18112E] tracking-tight text-base">{skill.name}</span>
            </motion.div>
        );
    };

    if (skills.length === 0) return null;

    return (
        <section id="skills" className="py-32 px-4 bg-white relative z-10 border-t border-neutral-100/50">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <span className="w-10 h-1 bg-[#18112E] rounded-full" />
                        <span className="text-[#18112E] font-extrabold tracking-widest text-sm uppercase">Capabilities</span>
                        <span className="w-10 h-1 bg-[#18112E] rounded-full" />
                    </div>

                    <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-black text-[#18112E] tracking-tighter text-center mb-24 uppercase leading-[0.9]">
                        Tech <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-400 to-neutral-300">Arsenal.</span>
                    </h2>

                    <div className="space-y-16 max-w-5xl mx-auto bg-white p-12 rounded-[40px] border border-neutral-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
                        {frontendSkills.length > 0 && (
                            <div className="flex flex-col md:flex-row gap-8 md:items-start">
                                <h3 className="w-48 text-2xl font-black text-[#18112E] uppercase tracking-tight pt-3 border-t-2 border-neutral-100 md:border-none md:pt-0">
                                    Frontend
                                </h3>
                                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="flex-1 flex flex-wrap gap-4">
                                    {frontendSkills.map((skill) => (
                                        <SkillPill key={skill.id} skill={skill} />
                                    ))}
                                </motion.div>
                            </div>
                        )}
                        {backendSkills.length > 0 && (
                            <div className="flex flex-col md:flex-row gap-8 md:items-start">
                                <h3 className="w-48 text-2xl font-black text-[#18112E] uppercase tracking-tight pt-3 border-t-2 border-neutral-100 md:border-none md:pt-0">
                                    Backend & Data
                                </h3>
                                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="flex-1 flex flex-wrap gap-4">
                                    {backendSkills.map((skill) => (
                                        <SkillPill key={skill.id} skill={skill} />
                                    ))}
                                </motion.div>
                            </div>
                        )}
                        {otherSkills.length > 0 && (
                            <div className="flex flex-col md:flex-row gap-8 md:items-start">
                                <h3 className="w-48 text-2xl font-black text-[#18112E] uppercase tracking-tight pt-3 border-t-2 border-neutral-100 md:border-none md:pt-0">
                                    Tools & Ops
                                </h3>
                                <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="flex-1 flex flex-wrap gap-4">
                                    {otherSkills.map((skill) => (
                                        <SkillPill key={skill.id} skill={skill} />
                                    ))}
                                </motion.div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
