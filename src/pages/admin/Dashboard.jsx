import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FolderKanban, Sparkles, Award, MessageSquare,
    Settings, Layers, Activity, ChevronRight, X, ArrowUpRight
} from 'lucide-react';

// Theme Colors
const COLORS = {
    yellow: '#FFB800',
    dark: '#18112E',
    gray: '#F8F9FA',
    white: '#FFFFFF',
    line: '#E5E7EB',
    cyan: '#3AA8F5'
};

const NODES = [
    { id: 'projects', label: 'Projects', icon: FolderKanban, pos: [-4, 0, -2], path: '/admin/projects', countKey: 'projects', desc: 'Manage your portfolio projects, case studies, and live links.' },
    { id: 'skills', label: 'Skills', icon: Sparkles, pos: [3, 0, -4], path: '/admin/skills', countKey: 'skills', desc: 'Update technical abilities, tools, and proficiency levels.' },
    { id: 'achievements', label: 'Awards', icon: Award, pos: [-3, 0, 3], path: '/admin/achievements', countKey: 'achievements', desc: 'Showcase certifications, awards, and major milestones.' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, pos: [4, 0, 2], path: '/admin/messages', countKey: 'messages', desc: 'Read and manage incoming contact requests and inquiries.' },
];

export default function Dashboard() {
    const store = useStore();
    const [selectedNode, setSelectedNode] = useState(null);

    const activeData = selectedNode ? NODES.find(n => n.id === selectedNode) : null;

    return (
        <div className="w-full h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] relative bg-[#F2F4F7] rounded-[16px] md:rounded-[32px] overflow-hidden shadow-inner flex flex-col md:flex-row font-sans">
            <div className="absolute inset-0 pattern-dots text-neutral-200/[0.4] opacity-50 bg-[size:24px_24px]"></div>

            {/* 3D Canvas Area */}
            <div className="flex-1 h-full relative cursor-pointer z-10" onClick={() => setSelectedNode(null)}>

                {/* Top Info Tag */}
                <div className="absolute top-8 left-8 z-10">
                    <div className="bg-white/80 backdrop-blur-md border border-white px-4 py-2.5 rounded-[12px] shadow-sm flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-[#FFB800] rounded-full animate-pulse" />
                        <span className="text-xs font-bold text-[#18112E] tracking-wide uppercase">System Map</span>
                    </div>
                </div>

                {/* 2D Interactive Node Map Area */}
                <div className="absolute inset-0 flex items-center justify-center p-4 md:p-12 lg:p-20">
                    <div className="relative w-full max-w-4xl h-full max-h-[600px] border-2 md:border-4 border-[#18112E]/10 rounded-[24px] md:rounded-[48px] bg-white/40 shadow-xl flex items-center justify-center overflow-hidden">

                        {/* Connecting Lines (SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0px 10px 10px rgba(0,0,0,0.05))' }}>
                            {NODES.map((node, i) => {
                                // Calculate percentages based on pos array mapping to screen space (-5 to 5 space approx)
                                const px = 50 + (node.pos[0] * 8);
                                const py = 50 + (node.pos[2] * 8);
                                return (
                                    <line
                                        key={i}
                                        x1="50%"
                                        y1="50%"
                                        x2={`${px}%`}
                                        y2={`${py}%`}
                                        stroke={selectedNode === node.id ? COLORS.yellow : COLORS.line}
                                        strokeWidth={selectedNode === node.id ? "4" : "2"}
                                        strokeDasharray={selectedNode === node.id ? "10,5" : "none"}
                                        className="transition-all duration-500"
                                    />
                                );
                            })}
                        </svg>

                        {/* Central Hub */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-20 h-20 md:w-32 md:h-32 bg-[#18112E] rounded-[20px] md:rounded-[32px] border-2 md:border-4 border-[#18112E] shadow-[4px_4px_0_#FFB800] md:shadow-[8px_8px_0_#FFB800] flex flex-col items-center justify-center text-white"
                        >
                            <Settings className="w-6 h-6 md:w-10 md:h-10 mb-1 md:mb-2" />
                            <span className="text-[8px] md:text-xs font-black tracking-widest uppercase">Core DB</span>
                        </motion.div>

                        {/* Nodes */}
                        {NODES.map((node, i) => {
                            const isSelected = selectedNode === node.id;
                            const px = 50 + (node.pos[0] * 8);
                            const py = 50 + (node.pos[2] * 8);

                            return (
                                <motion.button
                                    key={node.id}
                                    onClick={(e) => { e.stopPropagation(); setSelectedNode(node.id); }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        y: isSelected ? -10 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 300, delay: i * 0.1 }}
                                    style={{
                                        left: `${px}%`,
                                        top: `${py}%`,
                                        transform: 'translate(-50%, -50%)' // Align centering
                                    }}
                                    className={`absolute z-20 w-auto min-w-[80px] md:min-w-[140px] p-2 md:p-4 flex flex-col items-center gap-1 md:gap-3 rounded-[14px] md:rounded-[24px] border-2 md:border-4 transition-all duration-300 ${isSelected
                                        ? 'bg-[#FFB800] border-[#18112E] shadow-[4px_4px_0_#18112E] md:shadow-[8px_8px_0_#18112E] scale-110 z-30'
                                        : 'bg-white border-[#18112E] shadow-[2px_2px_0_#18112E] md:shadow-[4px_4px_0_#18112E] hover:-translate-y-2 hover:shadow-[4px_4px_0_#18112E] md:hover:shadow-[6px_6px_0_#18112E]'
                                        }`}
                                >
                                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-[10px] md:rounded-[16px] flex items-center justify-center transition-colors ${isSelected ? 'bg-[#18112E] text-white' : 'bg-[#F8F9FA] text-[#18112E] border border-[#18112E] md:border-2'
                                        }`}>
                                        <node.icon className="w-4 h-4 md:w-6 md:h-6" />
                                    </div>
                                    <span className="font-black text-[#18112E] text-[9px] md:text-sm uppercase tracking-wider">{node.label}</span>
                                    {isSelected && <ArrowUpRight className="absolute top-1 right-1 md:top-3 md:right-3 w-3 h-3 md:w-5 md:h-5 text-[#18112E] opacity-50" />}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Helper Tooltip - hidden on mobile */}
                <div className="absolute bottom-8 left-8 z-10 pointer-events-none hidden md:block">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/80 backdrop-blur-md text-[#18112E] px-5 py-4 rounded-[20px] shadow-sm border border-white flex items-center gap-3 w-[320px]"
                    >
                        <div className="w-10 h-10 rounded-full bg-[#F8F9FA] border border-neutral-100 flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5 text-[#FFB800]" />
                        </div>
                        <p className="text-xs font-bold leading-relaxed text-neutral-500">
                            Navigate the isometric map by clicking on active modules to reveal controls.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Slide-in Detail Panel */}
            <AnimatePresence>
                {activeData && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="hidden md:flex w-[440px] h-full bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.03)] relative z-20 flex-col border-l border-neutral-100 rounded-l-[32px] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-neutral-50 flex items-center justify-between bg-[#F8F9FA]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-[16px] bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-[#18112E]">
                                    <activeData.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#18112E]">{activeData.label}</h3>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#FFB800]">System Module</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="w-10 h-10 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-400 hover:text-[#18112E] hover:border-neutral-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 flex-1 overflow-y-auto">
                            <p className="text-[15px] font-medium text-neutral-500 mb-8 leading-relaxed">
                                {activeData.desc}
                            </p>

                            <div className="space-y-4">
                                {/* Stat Card */}
                                <div className="bg-white rounded-[24px] p-6 border border-neutral-100 shadow-sm hover:border-[#FFB800] transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[#F8F9FA] flex items-center justify-center text-[#18112E]">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Total Entries</span>
                                    </div>
                                    <p className="text-4xl font-extrabold text-[#18112E]">
                                        {store[activeData.countKey]?.length || 0}
                                    </p>
                                </div>

                                {/* Action Card */}
                                <div className="bg-[#18112E] rounded-[24px] p-6 text-white relative overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-10">
                                        <Settings className="w-32 h-32" />
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-[#FFB800] text-[#18112E] flex items-center justify-center mb-4 relative z-10">
                                        <Settings className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold text-lg mb-2 relative z-10">Data Operations</h4>
                                    <p className="text-neutral-400 text-sm font-medium relative z-10 leading-relaxed">Instantly view, modify, and restructure records.</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer Action */}
                        <div className="p-8 bg-white border-t border-neutral-50">
                            <Link
                                to={activeData.path}
                                className="flex items-center justify-center gap-3 w-full bg-[#FFB800] text-[#18112E] py-4 rounded-[16px] text-lg font-bold hover:bg-[#ffcc33] transition-all shadow-[0_10px_20px_rgba(255,184,0,0.2)] group"
                            >
                                <span>Access Module</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Bottom Sheet when node selected */}
            <AnimatePresence>
                {activeData && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white rounded-t-[24px] border-t-2 border-[#18112E] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-5 pb-8"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-[12px] bg-[#FFB800] flex items-center justify-center text-[#18112E]">
                                    <activeData.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#18112E]">{activeData.label}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFB800]">System Module</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="w-8 h-8 rounded-full bg-[#F8F9FA] flex items-center justify-center text-neutral-400"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-sm text-neutral-500 font-medium mb-4">{activeData.desc}</p>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1 bg-[#F8F9FA] rounded-[14px] p-4 border border-neutral-100">
                                <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-1">Entries</span>
                                <span className="text-2xl font-extrabold text-[#18112E]">{store[activeData.countKey]?.length || 0}</span>
                            </div>
                        </div>
                        <Link
                            to={activeData.path}
                            className="flex items-center justify-center gap-2 w-full bg-[#FFB800] text-[#18112E] py-3.5 rounded-[14px] font-bold text-base shadow-md"
                        >
                            <span>Access Module</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
