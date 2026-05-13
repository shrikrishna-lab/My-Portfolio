import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { Award, Calendar, X } from 'lucide-react';

export default function Achievements() {
    const achievements = useStore((state) => state.achievements);
    const [selectedItem, setSelectedItem] = useState(null);

    if (achievements.length === 0) return null;

    return (
        <section id="achievements" className="py-32 px-4 bg-[#3AA8F5] border-t-2 border-[#18112E] relative z-10 overflow-hidden">
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-white/20 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-6xl mx-auto relative text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <span className="w-10 h-1 bg-[#18112E]" />
                        <span className="text-[#18112E] font-extrabold tracking-wider text-sm uppercase">Recognition</span>
                        <span className="w-10 h-1 bg-[#18112E]" />
                    </div>

                    <h2 className="text-5xl md:text-8xl font-black text-[#18112E] tracking-tighter uppercase leading-[0.9] mb-24">
                        Trophies & <br />
                        <span className="text-white drop-shadow-[4px_4px_0_rgba(24,17,46,1)]">Milestones.</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {achievements.map((item, i) => (
                        <motion.div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            whileHover={{ y: -5, transition: { type: "spring", stiffness: 300, damping: 25 } }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 20 }}
                            className="bg-white border-4 border-[#18112E] shadow-[8px_8px_0_#18112E] rounded-[32px] p-8 hover:bg-[#FFB800] transition-all group relative overflow-hidden cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-[20px] bg-[#F8F9FA] border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] flex items-center justify-center mb-6 group-hover:bg-[#18112E] transition-colors">
                                    <Award className="w-8 h-8 text-[#18112E] group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-black text-[#18112E] mb-3 tracking-tight group-hover:text-[#18112E] transition-colors line-clamp-2">{item.title}</h3>
                                {item.date && (
                                    <div className="flex items-center gap-2 text-sm font-bold text-neutral-600 group-hover:text-[#18112E] transition-colors uppercase tracking-wider">
                                        <Calendar className="w-4 h-4" />
                                        {item.date}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Expanded Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#18112E]/60 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-white border-4 border-[#18112E] shadow-[12px_12px_0_#FFB800] rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between p-6 border-b-4 border-[#18112E] bg-[#F8F9FA]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[16px] bg-[#FFB800] border-2 border-[#18112E] flex items-center justify-center text-[#18112E]">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#18112E] uppercase tracking-wide">{selectedItem.title}</h3>
                                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{selectedItem.date}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedItem(null)}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-[#18112E] flex items-center justify-center text-[#18112E] shadow-[2px_2px_0_#18112E] hover:bg-[#FFB800] hover:translate-y-px transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto w-full">
                                {selectedItem.imageUrl ? (
                                    <div className="w-full h-auto max-h-[400px] border-b-4 border-[#18112E] bg-neutral-100 flex items-center justify-center overflow-hidden">
                                        <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-contain" />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 border-b-4 border-[#18112E] bg-[#F8F9FA] flex flex-col items-center justify-center text-neutral-400 gap-2">
                                        <Award className="w-10 h-10" />
                                        <span className="text-sm font-bold uppercase tracking-wider">No Image Attached</span>
                                    </div>
                                )}

                                {selectedItem.description && (
                                    <div className="p-8">
                                        <p className="text-lg font-medium text-[#18112E] leading-relaxed whitespace-pre-wrap">
                                            {selectedItem.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
