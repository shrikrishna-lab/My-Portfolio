import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Pencil, Trash2, X, Github, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyProject = { title: '', description: '', techStack: '', imageUrl: '', githubUrl: '', liveUrl: '' };

export default function ProjectsMgmt() {
    const projects = useStore((s) => s.projects);
    const addProject = useStore((s) => s.addProject);
    const updateProject = useStore((s) => s.updateProject);
    const deleteProject = useStore((s) => s.deleteProject);
    const uploadImage = useStore((s) => s.uploadImage);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProject);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const openNew = () => { setEditing(null); setForm(emptyProject); setModalOpen(true); };
    const openEdit = (project) => {
        setEditing(project.id);
        setForm({
            title: project.title,
            description: project.description,
            techStack: project.techStack,
            imageUrl: project.imageUrl || '',
            githubUrl: project.githubUrl || '',
            liveUrl: project.liveUrl || '',
        });
        setModalOpen(true);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const { url, error } = await uploadImage(file);
        setUploading(false);
        if (url) setForm({ ...form, imageUrl: url });
        if (error) alert('Upload error: ' + error.message);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        if (editing) {
            await updateProject(editing, form);
        } else {
            await addProject(form);
        }
        setSaving(false);
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this project?')) return;
        await deleteProject(id);
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#18112E] tracking-tight">Projects Matrix</h1>
                    <p className="text-neutral-500 mt-1 md:mt-2 font-medium text-sm md:text-base">Manage and deploy your case studies.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-6 py-3.5 rounded-[16px] font-bold hover:bg-[#ffcc33] transition-all shadow-md active:scale-95 z-10"
                >
                    <Plus className="w-5 h-5" />
                    <span>Deploy Project</span>
                </button>
            </div>

            {/* Grid */}
            {projects.length === 0 ? (
                <div className="text-center py-24 text-neutral-400 font-bold bg-white rounded-[32px] border border-neutral-100 border-dashed">
                    No active projects. Initiate deployment.
                </div>
            ) : (
                <div className="grid lg:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <motion.div
                            key={project.id}
                            layout
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white border border-neutral-100 rounded-[20px] md:rounded-[32px] overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-all group flex flex-col pt-0 relative"
                        >
                            {/* Actions Top Right - always visible on mobile */}
                            <div className="absolute right-3 top-3 md:right-4 md:top-4 z-20 flex gap-1.5 md:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(project)} className="bg-white/90 backdrop-blur text-[#18112E] p-2 rounded-[10px] md:rounded-[12px] shadow hover:bg-[#FFB800] transition-colors"><Pencil className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                                <button onClick={() => handleDelete(project.id)} className="bg-white/90 backdrop-blur text-red-500 p-2 rounded-[10px] md:rounded-[12px] shadow hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                            </div>

                            {/* Image Wrapper */}
                            <div className="h-[160px] md:h-[220px] overflow-hidden relative bg-[#F8F9FA]">
                                {project.imageUrl ? (
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-neutral-300">
                                        <ImageIcon className="w-12 h-12" />
                                    </div>
                                )}
                            </div>

                            {/* Content Block */}
                            <div className="p-5 md:p-8 flex flex-col flex-1 bg-white relative">
                                <div className="absolute -top-5 left-8 bg-[#18112E] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full z-10">
                                    Active
                                </div>
                                <h3 className="text-2xl font-bold text-[#18112E] mt-2 mb-3">{project.title}</h3>
                                <p className="text-neutral-500 font-medium text-sm leading-relaxed mb-6 flex-1">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.techStack?.split(',').map((t, i) => (
                                        <span key={i} className="text-xs font-bold px-3 py-1.5 bg-[#F8F9FA] border border-neutral-100 text-[#18112E] rounded-[8px] uppercase">{t.trim()}</span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#F8F9FA] text-[#18112E] hover:bg-neutral-200 transition-colors w-10 h-10 rounded-[12px]"><Github className="w-5 h-5" /></a>}
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#18112E] text-white hover:bg-[#FFB800] hover:text-[#18112E] transition-colors flex-1 h-10 rounded-[12px] font-bold text-sm"><span>Launch Platform</span><ExternalLink className="w-4 h-4" /></a>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-t-[24px] md:rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                            <div className="flex items-center justify-between p-8 border-b border-neutral-100 bg-[#F8F9FA]">
                                <h2 className="text-2xl font-bold text-[#18112E] flex items-center gap-3">
                                    <div className="w-3 h-3 bg-[#FFB800] rounded-full" />
                                    {editing ? 'Update Protocol' : 'Deploy New Protocol'}
                                </h2>
                                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-2 rounded-full border border-neutral-100 shadow-sm transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Project Title</label>
                                    <input placeholder="Enter title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Description Strategy</label>
                                    <textarea placeholder="Outline project details..." rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none resize-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Technology Matrix (CSV)</label>
                                    <input placeholder="React, Node.js, Next.js" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E] block">Visual Asset Interface</label>
                                    <div className="flex gap-3">
                                        <input placeholder="Image URL (Direct input)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                        <label className="flex items-center justify-center min-w-[120px] bg-[#18112E] text-white hover:bg-[#FFB800] hover:text-[#18112E] rounded-[16px] px-5 font-bold text-sm cursor-pointer transition-colors shadow-md group">
                                            {uploading ? 'Processing...' : 'Upload'}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    {form.imageUrl && (
                                        <div className="mt-4 rounded-[16px] border border-neutral-100 overflow-hidden bg-[#F8F9FA]">
                                            <img src={form.imageUrl} alt="preview" className="h-40 w-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#18112E]">Source Vector</label>
                                        <input placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-[#18112E]">Live Vector</label>
                                        <input placeholder="Deployed URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-neutral-100 bg-white flex gap-4">
                                <button onClick={() => setModalOpen(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-4 rounded-[16px] hover:bg-neutral-200 transition-colors">Cancel Protocol</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-4 rounded-[16px] hover:bg-[#ffcc33] transition-colors disabled:opacity-50 shadow-md">
                                    {saving ? 'Transmitting...' : editing ? 'Commit Data' : 'Initialize Deploy'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
