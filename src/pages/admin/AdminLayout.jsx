import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderKanban,
    Sparkles,
    Award,
    MessageSquare,
    LogOut,
    ArrowRight,
    Globe,
    Menu,
    X
} from 'lucide-react';

const navLinks = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Skills', path: '/admin/skills', icon: Sparkles },
    { name: 'Awards', path: '/admin/achievements', icon: Award },
    { name: 'Inbox', path: '/admin/messages', icon: MessageSquare },
];

export default function AdminLayout() {
    const logout = useStore((state) => state.logout);
    const navigate = useNavigate();
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#18112E] flex flex-col font-sans selection:bg-[#FFB800]/30 selection:text-black">

            {/* Top Header */}
            <header className="h-[70px] md:h-[80px] w-full bg-white border-b border-neutral-100 px-4 md:px-6 lg:px-12 flex items-center justify-between sticky top-0 z-50 shadow-sm">

                {/* Logo + Mobile Hamburger */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileNavOpen(true)}
                        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-[#F8F9FA] border border-neutral-200 text-[#18112E] active:scale-95 transition-transform"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="text-xl md:text-2xl font-extrabold tracking-tight">Admin<span className="text-[#FFB800]">.</span></span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            end={link.end}
                            className={({ isActive }) =>
                                `relative px-5 py-2.5 rounded-[12px] text-[15px] font-bold transition-all ${isActive
                                    ? 'text-[#18112E] bg-neutral-100/50'
                                    : 'text-neutral-500 hover:text-[#18112E] hover:bg-neutral-50'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <div className="flex items-center gap-2">
                                    <link.icon className={`w-4 h-4 ${isActive ? 'text-[#FFB800]' : ''}`} />
                                    <span>{link.name}</span>
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden sm:flex items-center gap-2 bg-[#F8F9FA] text-[#18112E] px-3 md:px-4 py-2 md:py-2.5 rounded-[12px] border border-neutral-100 text-sm font-bold hover:border-neutral-200 transition-colors cursor-pointer">
                        <Globe className="w-4 h-4" />
                        <span>EN</span>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-[#18112E] text-white px-4 md:px-5 py-2 md:py-2.5 rounded-[12px] font-bold hover:bg-[#FFB800] transition-colors shadow-md group text-sm md:text-base"
                    >
                        <span className="hidden sm:inline">Sign Out</span>
                        <LogOut className="w-4 h-4 sm:hidden" />
                        <ArrowRight className="w-4 h-4 text-[#FFB800] group-hover:text-[#18112E] hidden sm:block" />
                    </button>
                </div>
            </header>

            {/* Mobile Slide-out Navigation */}
            <AnimatePresence>
                {mobileNavOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setMobileNavOpen(false)}
                            className="fixed inset-0 z-[60] bg-[#18112E]/40 backdrop-blur-sm md:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[70] flex flex-col shadow-2xl md:hidden"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                                <span className="text-xl font-extrabold tracking-tight">Admin<span className="text-[#FFB800]">.</span></span>
                                <button
                                    onClick={() => setMobileNavOpen(false)}
                                    className="w-9 h-9 rounded-full bg-[#F8F9FA] border border-neutral-200 flex items-center justify-center text-neutral-500 hover:text-[#18112E] active:scale-95 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Nav Links */}
                            <nav className="flex-1 flex flex-col gap-1 px-4 py-6">
                                {navLinks.map((link, i) => (
                                    <NavLink
                                        key={link.path}
                                        to={link.path}
                                        end={link.end}
                                        onClick={() => setMobileNavOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3.5 rounded-[14px] text-[15px] font-bold transition-all ${isActive
                                                ? 'text-[#18112E] bg-[#FFB800]/10 border border-[#FFB800]/30'
                                                : 'text-neutral-500 hover:text-[#18112E] hover:bg-neutral-50 border border-transparent'
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${isActive ? 'bg-[#FFB800] text-[#18112E]' : 'bg-[#F8F9FA] text-neutral-400'}`}>
                                                    <link.icon className="w-4 h-4" />
                                                </div>
                                                <span>{link.name}</span>
                                            </>
                                        )}
                                    </NavLink>
                                ))}
                            </nav>

                            {/* Drawer Footer */}
                            <div className="px-4 pb-6">
                                <button
                                    onClick={() => { setMobileNavOpen(false); handleLogout(); }}
                                    className="w-full flex items-center justify-center gap-2 bg-[#18112E] text-white px-5 py-3.5 rounded-[14px] font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 mx-auto w-full max-w-[1400px]">
                <Outlet />
            </main>

        </div>
    );
}
