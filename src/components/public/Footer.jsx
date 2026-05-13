import { Github, Linkedin, Twitter, Command } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function Footer() {
    const profile = useStore((state) => state.profile);

    if (!profile) return null;

    return (
        <footer className="bg-white pt-32 pb-16 px-4 relative z-10 border-t-2 border-[#18112E] overflow-hidden">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#3AA8F5]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative flex flex-col items-center gap-16">

                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="w-16 h-16 rounded-[20px] bg-[#18112E] flex items-center justify-center border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] mb-4">
                        <Command className="w-8 h-8 text-[#FFB800]" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black tracking-tighter text-[#18112E] mb-2 uppercase">{profile.name}</h2>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest text-sm">{profile.title || 'Digital Architect'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {profile.github && (
                        <motion.a whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} href={profile.github} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-[16px] bg-[#F8F9FA] border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] flex items-center justify-center hover:bg-[#18112E] hover:shadow-[6px_6px_0_#18112E] transition-colors group">
                            <Github className="w-6 h-6 text-[#18112E] group-hover:text-white transition-colors" />
                        </motion.a>
                    )}
                    {profile.linkedin && (
                        <motion.a whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} href={profile.linkedin} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-[16px] bg-[#F8F9FA] border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] flex items-center justify-center hover:bg-[#0A66C2] hover:shadow-[6px_6px_0_#18112E] transition-colors group">
                            <Linkedin className="w-6 h-6 text-[#18112E] group-hover:text-white transition-colors" />
                        </motion.a>
                    )}
                    {profile.twitter && (
                        <motion.a whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }} href={profile.twitter} target="_blank" rel="noreferrer" className="w-14 h-14 rounded-[16px] bg-[#F8F9FA] border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] flex items-center justify-center hover:bg-[#1DA1F2] hover:shadow-[6px_6px_0_#18112E] transition-colors group">
                            <Twitter className="w-6 h-6 text-[#18112E] group-hover:text-white transition-colors" />
                        </motion.a>
                    )}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 border-t-2 border-[#18112E] text-sm font-bold text-neutral-500">
                    <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-[#18112E] transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#18112E] transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
