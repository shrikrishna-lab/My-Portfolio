import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { ExternalLink, Github, ArrowUpRight, X, Code2, Eye } from 'lucide-react';

const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { delay: i * 0.15, type: "spring", stiffness: 120, damping: 20 },
    }),
};

export default function Projects() {
    const projects = useStore((state) => state.projects);
    const [selectedProject, setSelectedProject] = useState(null);

    if (projects.length === 0) return null;

    return (
        <section id="projects" className="py-32 px-4 relative z-10 bg-[#F8F9FA] border-t-2 border-[#18112E]">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3AA8F5]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative">
                <motion.div
                    className="text-left mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-10 h-1 bg-[#3AA8F5] rounded-full" />
                        <span className="text-[#3AA8F5] font-extrabold tracking-widest text-sm uppercase">Selected Works</span>
                    </div>
                    <h2 className="text-5xl md:text-8xl lg:text-[7rem] font-black text-[#18112E] tracking-tighter uppercase leading-[0.9]">
                        Featured<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-[#ffcc33]">Projects.</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-10 md:gap-14">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.id}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-80px' }}
                            whileHover={{ y: -8, transition: { type: "spring", stiffness: 200, damping: 25 } }}
                            className="group relative flex flex-col bg-white rounded-[32px] border-3 border-[#18112E] shadow-[6px_6px_0_#18112E] hover:shadow-[10px_10px_0_#18112E] transition-shadow duration-300 overflow-hidden cursor-pointer"
                            onClick={() => setSelectedProject(project)}
                        >
                            {/* Sneak Peek Image */}
                            <div className="relative overflow-hidden bg-neutral-100 aspect-[16/10]">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#18112E]/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <img
                                    src={project.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                {/* Hover overlay buttons */}
                                <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm border-2 border-[#18112E] rounded-xl text-sm font-black text-[#18112E] shadow-[2px_2px_0_#18112E]">
                                        <Eye className="w-4 h-4" /> View Details
                                    </button>
                                </div>
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-4 right-4 z-20 w-12 h-12 bg-white border-2 border-[#18112E] rounded-[14px] flex items-center justify-center text-[#18112E] shadow-[3px_3px_0_#18112E] opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all duration-500 hover:bg-[#FFB800]"
                                    >
                                        <ArrowUpRight className="w-5 h-5" />
                                    </a>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col p-7">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <h3 className="text-2xl font-black text-[#18112E] tracking-tight leading-tight">{project.title}</h3>
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="shrink-0 w-10 h-10 rounded-xl bg-[#F8F9FA] border-2 border-[#18112E] flex items-center justify-center text-[#18112E] hover:bg-[#18112E] hover:text-white transition-colors"
                                        >
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>

                                <p className="text-neutral-500 text-base mb-5 leading-relaxed font-medium line-clamp-2">
                                    {project.description}
                                </p>

                                {/* Tech Stack Pills */}
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.techStack?.split(',').map((tech, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#F8F9FA] border-2 border-[#18112E] text-[#18112E] uppercase tracking-wider"
                                        >
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedProject(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-[#18112E]/60 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            transition={{ type: "spring", stiffness: 200, damping: 22 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-3xl bg-white border-4 border-[#18112E] shadow-[12px_12px_0_#FFB800] rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header & Close */}
                            <div className="flex items-center justify-between p-6 border-b-4 border-[#18112E] bg-[#F8F9FA]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[16px] bg-[#FFB800] border-2 border-[#18112E] flex items-center justify-center text-[#18112E]">
                                        <Code2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-[#18112E] uppercase tracking-wide">{selectedProject.title}</h3>
                                        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Project Details</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="w-10 h-10 rounded-full bg-white border-2 border-[#18112E] flex items-center justify-center text-[#18112E] shadow-[2px_2px_0_#18112E] hover:bg-[#FFB800] transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto">
                                {/* Sneak Peek Image */}
                                <div className="w-full aspect-video bg-neutral-100 border-b-4 border-[#18112E] overflow-hidden">
                                    <img
                                        src={selectedProject.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070'}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Description */}
                                    <div>
                                        <h4 className="text-sm font-black text-[#18112E] uppercase tracking-widest mb-3">About This Project</h4>
                                        <p className="text-lg font-medium text-neutral-600 leading-relaxed whitespace-pre-wrap">
                                            {selectedProject.description || 'No description provided.'}
                                        </p>
                                    </div>

                                    {/* Tech Stack */}
                                    {selectedProject.techStack && (
                                        <div>
                                            <h4 className="text-sm font-black text-[#18112E] uppercase tracking-widest mb-3">Tech Used</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProject.techStack.split(',').map((tech, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="text-sm font-bold px-4 py-2 rounded-xl bg-[#F8F9FA] border-2 border-[#18112E] text-[#18112E] uppercase tracking-wider shadow-[2px_2px_0_#18112E]"
                                                    >
                                                        {tech.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Links */}
                                    <div className="flex gap-4 pt-4">
                                        {selectedProject.githubUrl && (
                                            <a
                                                href={selectedProject.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 bg-[#18112E] text-white rounded-[16px] font-bold border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] hover:bg-[#FFB800] hover:text-[#18112E] transition-all"
                                            >
                                                <Github className="w-5 h-5" /> Source Code
                                            </a>
                                        )}
                                        {selectedProject.liveUrl && (
                                            <a
                                                href={selectedProject.liveUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 px-6 py-3 bg-[#FFB800] text-[#18112E] rounded-[16px] font-bold border-2 border-[#18112E] shadow-[4px_4px_0_#18112E] hover:shadow-[6px_6px_0_#18112E] transition-all"
                                            >
                                                <ExternalLink className="w-5 h-5" /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
