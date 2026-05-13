import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Sparkles, FolderKanban, Award, MessageSquare,
    Plus, Pencil, Trash2, X, Save, Image as ImageIcon,
    Github, ExternalLink, UploadCloud, Check, Blocks
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
];

const emptySkill = { name: '', icon: 'Code', category: 'Frontend' };
const emptyProject = { title: '', description: '', techStack: '', imageUrl: '', githubUrl: '', liveUrl: '' };
const emptyAchievement = { title: '', date: '', description: '', imageUrl: '' };
const categories = ['Frontend', 'Backend', 'Tools'];
const popularIcons = ['Code', 'Server', 'Database', 'Brush', 'Terminal', 'Globe', 'Smartphone', 'Cloud', 'Shield', 'Cpu', 'GitBranch', 'Layers', 'Box', 'Figma', 'Chrome'];

function ProfileTab() {
    const profile = useStore((s) => s.profile);
    const updateProfile = useStore((s) => s.updateProfile);
    const [form, setForm] = useState({});
    const [saved, setSaved] = useState(false);
    const [init, setInit] = useState(false);

    if (profile && !init) {
        setForm({ ...profile });
        setInit(true);
    }

    const handleSave = async () => {
        await updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const Field = ({ label, field, multiline }) => {
        const val = form[field] || '';
        const cls = "w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium transition-all focus:outline-none placeholder-neutral-400";
        return (
            <div>
                <label className="text-xs font-bold text-[#18112E] mb-1.5 block">{label}</label>
                {multiline ? (
                    <textarea rows={4} value={val} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className={`${cls} resize-y min-h-[100px]`} />
                ) : (
                    <input type="text" value={val} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className={cls} />
                )}
            </div>
        );
    };

    if (!profile) return <div className="text-center py-12 text-neutral-400 font-bold">Loading...</div>;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#18112E]">Hero Identity</h2>
                <button onClick={handleSave} className="flex items-center gap-2 bg-[#18112E] text-white px-5 py-2.5 rounded-[12px] font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-all text-sm shadow-md">
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save</>}
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name" field="name" />
                <Field label="Headline Title" field="title" />
                <div className="md:col-span-2"><Field label="Brief Introduction" field="intro" multiline /></div>
                <div className="md:col-span-2"><Field label="Hero Image URL" field="characterImage" /></div>
            </div>
            <hr className="border-neutral-100" />
            <h2 className="text-xl font-bold text-[#18112E]">Personal Narrative</h2>
            <Field label="About You" field="aboutStory" multiline />
            <hr className="border-neutral-100" />
            <h2 className="text-xl font-bold text-[#18112E]">Startup Vision</h2>
            <Field label="Mission Statement" field="startupVision" multiline />
            <hr className="border-neutral-100" />
            <h2 className="text-xl font-bold text-[#18112E]">Social Connections</h2>
            <div className="grid md:grid-cols-2 gap-4">
                <Field label="Email" field="email" />
                <Field label="GitHub" field="github" />
                <Field label="LinkedIn" field="linkedin" />
                <Field label="Twitter / X" field="twitter" />
            </div>
            <div className="flex justify-end pt-2">
                <button onClick={handleSave} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-6 py-3 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all shadow-md text-sm">
                    {saved ? <><Check className="w-5 h-5" /> Published</> : <><Save className="w-5 h-5" /> Publish Changes</>}
                </button>
            </div>
        </div>
    );
}

function SkillsTab() {
    const skills = useStore((s) => s.skills);
    const addSkill = useStore((s) => s.addSkill);
    const updateSkill = useStore((s) => s.updateSkill);
    const deleteSkill = useStore((s) => s.deleteSkill);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptySkill);
    const [saving, setSaving] = useState(false);

    const openNew = () => { setEditing(null); setForm(emptySkill); setModal(true); };
    const openEdit = (s) => { setEditing(s.id); setForm({ name: s.name, icon: s.icon, category: s.category }); setModal(true); };
    const handleSave = async () => {
        if (!form.name.trim()) return;
        setSaving(true);
        if (editing) await updateSkill(editing, form);
        else await addSkill(form);
        setSaving(false);
        setModal(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#18112E]">Skills ({skills.length})</h2>
                <button onClick={openNew} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-4 py-2.5 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all shadow-md text-sm">
                    <Plus className="w-4 h-4" /> Add Skill
                </button>
            </div>
            <div className="bg-white border border-neutral-100 rounded-[16px] overflow-hidden shadow-sm">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-100 bg-[#F8F9FA] text-left text-xs font-extrabold text-[#18112E] uppercase tracking-widest">
                            <th className="px-5 py-3">Icon</th>
                            <th className="px-5 py-3">Name</th>
                            <th className="px-5 py-3">Category</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((sk) => {
                            const IconComp = LucideIcons[sk.icon] || LucideIcons.Code;
                            return (
                                <tr key={sk.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-5 py-3">
                                        <div className="w-9 h-9 flex items-center justify-center bg-white rounded-[10px] border border-neutral-100 text-[#18112E] group-hover:border-[#FFB800] transition-colors">
                                            <IconComp className="w-4 h-4" />
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 font-bold text-[#18112E]">{sk.name}</td>
                                    <td className="px-5 py-3">
                                        <span className="text-[10px] font-bold px-2.5 py-1 bg-[#F8F9FA] border border-neutral-100 text-[#18112E] rounded-[6px] uppercase">{sk.category}</span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(sk)} className="p-2 bg-white shadow-sm border border-neutral-100 rounded-[8px] text-[#18112E] hover:bg-[#FFB800] transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => { if (window.confirm('Delete this skill?')) deleteSkill(sk.id); }} className="p-2 bg-white shadow-sm border border-neutral-100 rounded-[8px] text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {skills.length === 0 && <div className="text-center py-12 text-neutral-400 font-bold">No skills yet.</div>}
            </div>

            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-4" onClick={() => setModal(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-[#F8F9FA]">
                                <h2 className="text-lg font-bold text-[#18112E]">{editing ? 'Edit Skill' : 'New Skill'}</h2>
                                <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-1.5 rounded-full border border-neutral-100 shadow-sm"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Skill Name</label>
                                    <input placeholder="React, Node.js..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Category</label>
                                    <div className="flex gap-2">
                                        {categories.map((cat) => (
                                            <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={`flex-1 py-2.5 text-xs font-bold rounded-[8px] transition-all border-2 ${form.category === cat ? 'bg-white border-[#FFB800] text-[#18112E] shadow-sm' : 'bg-[#F8F9FA] text-neutral-500 border-transparent'}`}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Icon</label>
                                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto">
                                        {popularIcons.map((iconName) => {
                                            const IC = LucideIcons[iconName] || LucideIcons.Code;
                                            return (
                                                <button key={iconName} onClick={() => setForm({ ...form, icon: iconName })} className={`w-10 h-10 rounded-[10px] flex items-center justify-center transition-all border-2 ${form.icon === iconName ? 'bg-white text-[#FFB800] border-[#FFB800] shadow-md' : 'bg-[#F8F9FA] text-neutral-400 border-transparent hover:border-neutral-200'}`}>
                                                    <IC className="w-5 h-5" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-neutral-100 bg-white flex gap-3">
                                <button onClick={() => setModal(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-neutral-200 transition-colors text-sm">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-[#ffcc33] transition-colors disabled:opacity-50 shadow-md text-sm">
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ProjectsTab() {
    const projects = useStore((s) => s.projects);
    const addProject = useStore((s) => s.addProject);
    const updateProject = useStore((s) => s.updateProject);
    const deleteProject = useStore((s) => s.deleteProject);
    const uploadImage = useStore((s) => s.uploadImage);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProject);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const openNew = () => { setEditing(null); setForm(emptyProject); setModal(true); };
    const openEdit = (p) => { setEditing(p.id); setForm({ title: p.title, description: p.description, techStack: p.techStack, imageUrl: p.imageUrl || '', githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '' }); setModal(true); };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const { url } = await uploadImage(file);
        setUploading(false);
        if (url) setForm({ ...form, imageUrl: url });
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        if (editing) await updateProject(editing, form);
        else await addProject(form);
        setSaving(false);
        setModal(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#18112E]">Projects ({projects.length})</h2>
                <button onClick={openNew} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-4 py-2.5 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all shadow-md text-sm">
                    <Plus className="w-4 h-4" /> Add Project
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
                {projects.map((p) => (
                    <div key={p.id} className="bg-white border border-neutral-100 rounded-[16px] overflow-hidden hover:shadow-md transition-all group relative">
                        <div className="absolute right-2 top-2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(p)} className="bg-white/90 backdrop-blur p-2 rounded-[8px] shadow hover:bg-[#FFB800] transition-colors"><Pencil className="w-3.5 h-3.5 text-[#18112E]" /></button>
                            <button onClick={() => { if (window.confirm('Delete this project?')) deleteProject(p.id); }} className="bg-white/90 backdrop-blur p-2 rounded-[8px] shadow hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                        </div>
                        <div className="h-[140px] overflow-hidden bg-[#F8F9FA]">
                            {p.imageUrl ? (
                                <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-neutral-300"><ImageIcon className="w-8 h-8" /></div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-[#18112E] text-lg">{p.title}</h3>
                            <p className="text-neutral-500 text-xs font-medium mt-1 line-clamp-2">{p.description}</p>
                            {p.techStack && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {p.techStack.split(',').map((t, i) => (
                                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-[#F8F9FA] border border-neutral-100 text-[#18112E] rounded-[4px] uppercase">{t.trim()}</span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-neutral-100">
                                {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-[#F8F9FA] rounded-[8px] hover:bg-neutral-200 transition-colors"><Github className="w-4 h-4 text-[#18112E]" /></a>}
                                {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-[#18112E] text-white px-3 py-1.5 rounded-[8px] font-bold text-[10px] hover:bg-[#FFB800] hover:text-[#18112E] transition-colors"><ExternalLink className="w-3 h-3" /> Live</a>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && <div className="text-center py-12 text-neutral-400 font-bold bg-white rounded-[16px] border border-dashed border-neutral-200">No projects yet.</div>}

            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-4" onClick={() => setModal(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-[#F8F9FA]">
                                <h2 className="text-lg font-bold text-[#18112E]">{editing ? 'Edit Project' : 'New Project'}</h2>
                                <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-1.5 rounded-full border border-neutral-100 shadow-sm"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Title</label>
                                    <input placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Description</label>
                                    <textarea rows={3} placeholder="Project description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Tech Stack (CSV)</label>
                                    <input placeholder="React, Node.js..." value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Image</label>
                                    <div className="flex gap-2">
                                        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                        <label className="flex items-center justify-center px-4 bg-[#18112E] text-white hover:bg-[#FFB800] hover:text-[#18112E] rounded-[12px] font-bold text-xs cursor-pointer transition-colors">
                                            {uploading ? '...' : 'Upload'}
                                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                    {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-24 w-full object-cover rounded-[8px] mt-2 border border-neutral-100" />}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-[#18112E] block mb-1.5">GitHub URL</label>
                                        <input placeholder="GitHub link" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-[#18112E] block mb-1.5">Live URL</label>
                                        <input placeholder="Live link" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-neutral-100 bg-white flex gap-3">
                                <button onClick={() => setModal(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-neutral-200 transition-colors text-sm">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-[#ffcc33] transition-colors disabled:opacity-50 shadow-md text-sm">
                                    {saving ? 'Saving...' : editing ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function AchievementsTab() {
    const achievements = useStore((s) => s.achievements);
    const addAchievement = useStore((s) => s.addAchievement);
    const updateAchievement = useStore((s) => s.updateAchievement);
    const deleteAchievement = useStore((s) => s.deleteAchievement);
    const uploadImage = useStore((s) => s.uploadImage);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyAchievement);
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef(null);

    const openNew = () => { setEditing(null); setForm(emptyAchievement); setModal(true); };
    const openEdit = (a) => { setEditing(a.id); setForm({ title: a.title, date: a.date || '', description: a.description || '', imageUrl: a.imageUrl || '' }); setModal(true); };

    const handleFile = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const { url } = await uploadImage(file);
        setUploading(false);
        if (url) setForm((prev) => ({ ...prev, imageUrl: url }));
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        if (editing) await updateAchievement(editing, form);
        else await addAchievement(form);
        setModal(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#18112E]">Achievements ({achievements.length})</h2>
                <button onClick={openNew} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-4 py-2.5 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all shadow-md text-sm">
                    <Plus className="w-4 h-4" /> Add Achievement
                </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((item) => (
                    <div key={item.id} className="bg-white border border-neutral-100 rounded-[16px] p-5 group hover:border-[#FFB800] transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 bg-[#F8F9FA] rounded-[12px] flex items-center justify-center group-hover:bg-[#FFB800] transition-colors border border-neutral-100">
                                <Award className="w-5 h-5 text-[#18112E]" />
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(item)} className="p-1.5 bg-[#F8F9FA] rounded-[8px] hover:bg-neutral-200 transition-colors"><Pencil className="w-3.5 h-3.5 text-[#18112E]" /></button>
                                <button onClick={() => { if (window.confirm('Delete this achievement?')) deleteAchievement(item.id); }} className="p-1.5 bg-[#F8F9FA] rounded-[8px] hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
                            </div>
                        </div>
                        {item.date && <span className="inline-block px-2.5 py-0.5 bg-[#F8F9FA] border border-neutral-100 text-[#18112E] text-[10px] font-bold uppercase rounded-[4px] mb-2 w-fit">{item.date}</span>}
                        <h3 className="font-extrabold text-[#18112E] text-lg leading-tight">{item.title}</h3>
                    </div>
                ))}
            </div>
            {achievements.length === 0 && <div className="text-center py-12 text-neutral-400 font-bold bg-white rounded-[16px] border border-dashed border-neutral-200">No achievements yet.</div>}

            <AnimatePresence>
                {modal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-4" onClick={() => setModal(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[24px] w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-[#F8F9FA]">
                                <h2 className="text-lg font-bold text-[#18112E]">{editing ? 'Edit Achievement' : 'New Achievement'}</h2>
                                <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-1.5 rounded-full border border-neutral-100 shadow-sm"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Image</label>
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-[12px] bg-[#F8F9FA] border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => fileRef.current?.click()}>
                                            {form.imageUrl ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-neutral-400" />}
                                            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><div className="w-4 h-4 border-2 border-[#18112E] border-t-transparent rounded-full animate-spin" /></div>}
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} />
                                            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] hover:bg-neutral-200 border border-neutral-200 rounded-[8px] text-xs font-bold text-[#18112E] transition-colors"><UploadCloud className="w-3 h-3" /> Upload</button>
                                            <input placeholder="Or paste URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[8px] px-3 py-1.5 text-xs text-[#18112E] font-medium outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Title</label>
                                    <input placeholder="Achievement title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Date / Year</label>
                                    <input placeholder="2024" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Description</label>
                                    <textarea rows={3} placeholder="Details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full min-h-[80px] resize-none bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                </div>
                            </div>
                            <div className="p-6 border-t border-neutral-100 bg-white flex gap-3">
                                <button onClick={() => setModal(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-neutral-200 transition-colors text-sm">Cancel</button>
                                <button onClick={handleSave} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-[#ffcc33] transition-colors shadow-md text-sm">{editing ? 'Update' : 'Add'}</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MessagesTab() {
    const messages = useStore((s) => s.messages);
    const deleteMessage = useStore((s) => s.deleteMessage);

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#18112E]">Messages ({messages.length})</h2>
            </div>
            {messages.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-[16px] border border-dashed border-neutral-200 text-neutral-400 font-bold">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No messages yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white border border-neutral-100 rounded-[16px] p-5 hover:shadow-sm transition-all group flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#F8F9FA] rounded-[10px] border border-neutral-100 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-[#FFB800]" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="font-bold text-[#18112E]">{msg.name}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F8F9FA] border border-neutral-100 rounded-[4px] text-neutral-500">{msg.email}</span>
                                </div>
                                <p className="text-sm text-neutral-600 font-medium">{msg.message}</p>
                                {msg.createdAt && <span className="text-[10px] text-neutral-400 font-bold mt-1 block">{new Date(msg.createdAt).toLocaleString()}</span>}
                            </div>
                            <button onClick={() => { if (window.confirm('Delete this message?')) deleteMessage(msg.id); }} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-[8px] transition-colors opacity-0 group-hover:opacity-100 shrink-0">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function UnifiedPanel() {
    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="space-y-6 font-sans">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div>
                    <h1 className="text-3xl font-bold text-[#18112E] tracking-tight">Control Panel</h1>
                    <p className="text-neutral-500 mt-1 font-medium text-sm">Manage everything from one place.</p>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all whitespace-nowrap shrink-0 ${isActive ? 'bg-[#FFB800] text-[#18112E] shadow-md' : 'bg-white text-neutral-500 border border-neutral-100 hover:border-[#FFB800] hover:text-[#18112E]'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                <div className="bg-white border border-neutral-100 rounded-[20px] p-6 shadow-sm">
                    {activeTab === 'profile' && <ProfileTab />}
                    {activeTab === 'skills' && <SkillsTab />}
                    {activeTab === 'projects' && <ProjectsTab />}
                    {activeTab === 'achievements' && <AchievementsTab />}
                    {activeTab === 'messages' && <MessagesTab />}
                </div>
            </motion.div>
        </div>
    );
}
