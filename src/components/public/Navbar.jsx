import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command } from 'lucide-react';
import { useStore } from '@/lib/store';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const profile = useStore((s) => s.profile);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-8 px-4 pointer-events-none"
            >
                <div
                    className={`pointer-events-auto flex items-center justify-between w-full max-w-6xl px-8 py-4 rounded-[24px] transition-all duration-500 border-2 ${scrolled
                        ? 'bg-white border-[#18112E] shadow-[8px_8px_0_#18112E]'
                        : 'bg-white/90 backdrop-blur-xl border-[#18112E] shadow-[4px_4px_0_#18112E]'
                        }`}
                >
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-3 text-[#18112E] hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-[12px] bg-[#18112E] flex items-center justify-center border border-neutral-800 shadow-md">
                            <Command className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-extrabold tracking-tight">
                            {profile?.name || 'Portfolio'}
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="px-5 py-2.5 text-sm font-bold text-neutral-500 hover:text-[#18112E] transition-colors rounded-[12px] hover:bg-neutral-100/80 active:bg-neutral-200"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="w-px h-6 bg-neutral-200" />
                        <motion.a
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            href="#contact"
                            className="px-6 py-3 text-sm font-bold bg-[#FFB800] text-[#18112E] border-2 border-[#18112E] rounded-[16px] shadow-[4px_4px_0_#18112E] hover:shadow-[6px_6px_0_#18112E] transition-all"
                        >
                            Hire Me
                        </motion.a>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        className="md:hidden flex items-center justify-center w-12 h-12 rounded-[16px] bg-white border border-neutral-100 text-[#18112E] hover:bg-neutral-50 transition-colors shadow-sm active:scale-95"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-[100] bg-[#F8F9FA] flex flex-col"
                    >
                        <div className="flex items-center justify-between p-8 border-b border-neutral-200 bg-white">
                            <div className="flex items-center gap-3 text-[#18112E]">
                                <div className="w-10 h-10 rounded-[12px] bg-[#18112E] flex items-center justify-center shadow-md">
                                    <Command className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-extrabold tracking-tight">
                                    Menu
                                </span>
                            </div>
                            <button
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-[#18112E] shadow-sm transition-colors active:scale-95"
                                onClick={() => setMobileOpen(false)}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-10 gap-8">
                            {navLinks.map((link, i) => (
                                <motion.a
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    key={link.name}
                                    href={link.href}
                                    className="text-5xl font-extrabold tracking-tighter text-neutral-300 hover:text-[#18112E] transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>

                        <div className="p-10 border-t border-neutral-200 bg-white flex flex-col gap-4">
                            <motion.a
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                href="#contact"
                                className="w-full py-5 bg-[#FFB800] text-[#18112E] text-center font-bold text-lg rounded-[20px] active:scale-95 shadow-[0_15px_30px_rgba(255,184,0,0.2)] transition-all"
                                onClick={() => setMobileOpen(false)}
                            >
                                Get in touch
                            </motion.a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
