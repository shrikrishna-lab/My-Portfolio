import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, User, Sparkles, FolderKanban, Award, MessageSquare, Settings,
    Plus, Pencil, Trash2, X, Save, Image as ImageIcon, Music, Play, Pause, Eye, EyeOff, VolumeX,
    Github, ExternalLink, UploadCloud, Check, Upload
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const REPO = 'shrikrishna-lab/My-Portfolio';
const FILE_PATH = 'public/data.json';
const BRANCH = 'main';
const TOKEN_KEY = 'github_token';
const ADMIN_PASSWORD = 'admin123';
const MUSIC_URL_KEY = 'music_url';
const MUSIC_NAME_KEY = 'music_name';
const BG_IMG_KEY = 'bg_image';
const BG_VID_KEY = 'bg_video';

function getToken() { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } }
function getMusicUrl() { try { return localStorage.getItem(MUSIC_URL_KEY) || ''; } catch { return ''; } }
function getMusicName() { try { return localStorage.getItem(MUSIC_NAME_KEY) || ''; } catch { return ''; } }
function setMusicUrl(v) { try { localStorage.setItem(MUSIC_URL_KEY, v); } catch {} }
function setMusicName(v) { try { localStorage.setItem(MUSIC_NAME_KEY, v); } catch {} }
function getBgImg() { try { return localStorage.getItem(BG_IMG_KEY) || ''; } catch { return ''; } }
function getBgVid() { try { return localStorage.getItem(BG_VID_KEY) || ''; } catch { return ''; } }
function setBgImg(v) { try { localStorage.setItem(BG_IMG_KEY, v); } catch {} }
function setBgVid(v) { try { localStorage.setItem(BG_VID_KEY, v); } catch {} }
function isYoutubeUrl(url) { return url && (url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('youtube.com/embed')); }
function getYoutubeEmbed(url) {
  let id = '';
  if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1]?.split('?')[0] || '';
  else if (url.includes('youtube.com/watch')) id = new URL(url).searchParams.get('v') || '';
  else if (url.includes('youtube.com/embed')) return url;
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&loop=1&mute=1&controls=0&playlist=${id}` : '';
}

const TABS = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Sparkles },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
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

    useEffect(() => {
        if (profile && !init) {
            setForm({ ...profile });
            setInit(true);
        }
    }, [profile, init]);

    const handleSave = async () => {
        updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const cls = "w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium transition-all focus:outline-none placeholder-neutral-400";

    function set(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function Field({ label, field, multiline }) {
        const val = form[field] || '';
        return (
            <div>
                <label className="text-xs font-bold text-[#18112E] mb-1.5 block">{label}</label>
                {multiline ? (
                    <textarea rows={4} value={val} onChange={(e) => set(field, e.target.value)} className={`${cls} resize-y min-h-[100px]`} />
                ) : (
                    <input type="text" value={val} onChange={(e) => set(field, e.target.value)} className={cls} />
                )}
        </div>
    );
}

    if (!profile) return <div className="text-center py-12 text-neutral-400 font-bold">Loading...</div>;

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#18112E]">Profile</h2>
                <button onClick={handleSave} className="flex items-center gap-2 bg-[#18112E] text-white px-5 py-2.5 rounded-[12px] font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-all text-sm shadow-md">
                    {saved ? <><Check className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save</>}
                </button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {Field({ label: 'Full Name', field: 'name' })}
                {Field({ label: 'Headline Title', field: 'title' })}
                <div className="md:col-span-2">{Field({ label: 'Brief Introduction', field: 'intro', multiline: true })}</div>
                <div className="md:col-span-2">{Field({ label: 'Hero Image URL', field: 'characterImage' })}</div>
            </div>
            <hr className="border-neutral-100" />
            <h2 className="text-xl font-bold text-[#18112E]">About</h2>
            {Field({ label: 'About You', field: 'aboutStory', multiline: true })}
            <hr className="border-neutral-100" />
            <h2 className="text-xl font-bold text-[#18112E]">Startup Vision</h2>
            {Field({ label: 'Mission Statement', field: 'startupVision', multiline: true })}
            <hr className="border-neutral-100" />
            <h2 className="text-xl font-bold text-[#18112E]">Social Links</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {Field({ label: 'Email', field: 'email' })}
                {Field({ label: 'GitHub', field: 'github' })}
                {Field({ label: 'LinkedIn', field: 'linkedin' })}
                {Field({ label: 'Twitter / X', field: 'twitter' })}
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
        if (editing) updateSkill(editing, form);
        else addSkill(form);
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
            <SkillModal modal={modal} setModal={setModal} editing={editing} form={form} setForm={setForm} saving={saving} handleSave={handleSave} />
        </div>
    );
}

function SkillModal({ modal, setModal, editing, form, setForm, saving, handleSave }) {
    return (
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
                                        <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={`flex-1 py-2.5 text-xs font-bold rounded-[8px] transition-all border-2 ${form.category === cat ? 'bg-white border-[#FFB800] text-[#18112E] shadow-sm' : 'bg-[#F8F9FA] text-neutral-500 border-transparent'}`}>{cat}</button>
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
        if (editing) updateProject(editing, form);
        else addProject(form);
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
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="flex items-center justify-center w-full h-full text-neutral-300"><ImageIcon className="w-8 h-8" /></div>}
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
            <ProjectModal modal={modal} setModal={setModal} editing={editing} form={form} setForm={setForm} saving={saving} handleSave={handleSave} uploading={uploading} handleImageUpload={handleImageUpload} />
        </div>
    );
}

function ProjectModal({ modal, setModal, editing, form, setForm, saving, handleSave, uploading, handleImageUpload }) {
    return (
        <AnimatePresence>
            {modal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-4" onClick={() => setModal(false)}>
                    <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[24px] w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-[#F8F9FA]">
                            <h2 className="text-lg font-bold text-[#18112E]">{editing ? 'Edit Project' : 'New Project'}</h2>
                            <button onClick={() => setModal(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-1.5 rounded-full border border-neutral-100 shadow-sm"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="p-6 space-y-4 overflow-y-auto flex-1">
                            <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Title</label><input placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
                            <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Description</label><textarea rows={3} placeholder="Project description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all resize-none" /></div>
                            <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Tech Stack (CSV)</label><input placeholder="React, Node.js..." value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
                            <div>
                                <label className="text-xs font-bold text-[#18112E] block mb-1.5">Image</label>
                                <div className="flex gap-2">
                                    <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" />
                                    <label className="flex items-center justify-center px-4 bg-[#18112E] text-white hover:bg-[#FFB800] hover:text-[#18112E] rounded-[12px] font-bold text-xs cursor-pointer transition-colors">{uploading ? '...' : 'Upload'}<input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /></label>
                                </div>
                                {form.imageUrl && <img src={form.imageUrl} alt="preview" className="h-24 w-full object-cover rounded-[8px] mt-2 border border-neutral-100" />}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">GitHub URL</label><input placeholder="GitHub link" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
                                <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Live URL</label><input placeholder="Live link" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-neutral-100 bg-white flex gap-3">
                            <button onClick={() => setModal(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-neutral-200 transition-colors text-sm">Cancel</button>
                            <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-[#ffcc33] transition-colors disabled:opacity-50 shadow-md text-sm">{saving ? 'Saving...' : editing ? 'Update' : 'Add'}</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
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
        if (editing) updateAchievement(editing, form);
        else addAchievement(form);
        setModal(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#18112E]">Achievements ({achievements.length})</h2>
                <button onClick={openNew} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-4 py-2.5 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all shadow-md text-sm"><Plus className="w-4 h-4" /> Add Achievement</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((item) => (
                    <div key={item.id} className="bg-white border border-neutral-100 rounded-[16px] p-5 group hover:border-[#FFB800] transition-all relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-10 h-10 bg-[#F8F9FA] rounded-[12px] flex items-center justify-center group-hover:bg-[#FFB800] transition-colors border border-neutral-100"><Award className="w-5 h-5 text-[#18112E]" /></div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(item)} className="p-1.5 bg-[#F8F9FA] rounded-[8px] hover:bg-neutral-200"><Pencil className="w-3.5 h-3.5 text-[#18112E]" /></button>
                                <button onClick={() => { if (window.confirm('Delete?')) deleteAchievement(item.id); }} className="p-1.5 bg-[#F8F9FA] rounded-[8px] hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-500" /></button>
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
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleFile} />
                                            <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F8F9FA] hover:bg-neutral-200 border border-neutral-200 rounded-[8px] text-xs font-bold text-[#18112E] transition-colors"><UploadCloud className="w-3 h-3" /> Upload</button>
                                            <input placeholder="Or paste URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[8px] px-3 py-1.5 text-xs text-[#18112E] font-medium outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Title</label><input placeholder="Achievement title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
                                <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Date / Year</label><input placeholder="2024" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
                                <div><label className="text-xs font-bold text-[#18112E] block mb-1.5">Description</label><textarea rows={3} placeholder="Details..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full min-h-[80px] resize-none bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-[#18112E] font-medium outline-none transition-all" /></div>
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
                <div className="text-center py-12 bg-white rounded-[16px] border border-dashed border-neutral-200 text-neutral-400 font-bold"><MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />No messages yet.</div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white border border-neutral-100 rounded-[16px] p-5 hover:shadow-sm transition-all group flex items-start gap-4">
                            <div className="w-10 h-10 bg-[#F8F9FA] rounded-[10px] border border-neutral-100 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-[#FFB800]" /></div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="font-bold text-[#18112E]">{msg.name}</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F8F9FA] border border-neutral-100 rounded-[4px] text-neutral-500">{msg.email}</span>
                                </div>
                                <p className="text-sm text-neutral-600 font-medium">{msg.message}</p>
                                {msg.createdAt && <span className="text-[10px] text-neutral-400 font-bold mt-1 block">{new Date(msg.createdAt).toLocaleString()}</span>}
                            </div>
                            <button onClick={() => { if (window.confirm('Delete this message?')) deleteMessage(msg.id); }} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-[8px] transition-colors opacity-0 group-hover:opacity-100 shrink-0"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function PasswordGate({ children }) {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [authed, setAuthed] = useState(() => {
        try { return sessionStorage.getItem('admin_auth') === 'true'; } catch { return false; }
    });

    if (authed) return children;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input === ADMIN_PASSWORD) {
            try { sessionStorage.setItem('admin_auth', 'true'); } catch {}
            setAuthed(true);
            setError('');
        } else {
            setError('Wrong password.');
            setInput('');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4 font-sans" style={getBgImg() ? { backgroundImage: `url(${getBgImg()})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur border border-neutral-100 rounded-[24px] p-8 shadow-sm w-full max-w-sm space-y-6">
                <div className="text-center">
                    <div className="w-14 h-14 bg-[#FFB800] rounded-[16px] flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-7 h-7 text-[#18112E]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#18112E]">Admin Access</h1>
                    <p className="text-sm text-neutral-500 font-medium mt-1">Enter the admin password to continue.</p>
                </div>
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-[12px] text-sm font-bold text-center">{error}</div>
                )}
                <input type="password" placeholder="Password" value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[12px] px-4 py-3 text-center text-lg font-bold text-[#18112E] outline-none transition-all tracking-widest" autoFocus />
                <button type="submit" className="w-full bg-[#FFB800] text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-[#ffcc33] transition-all shadow-md">Unlock</button>
            </form>
        </div>
    );
}

function SettingsTab() {
    const [tokenInput, setTokenInput] = useState(getToken());

    const [deploying, setDeploying] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });
    const store = useStore;

    const saveToken = () => {
        try { localStorage.setItem(TOKEN_KEY, tokenInput); } catch {}
        setMsg({ text: 'Token saved.', type: 'success' });
        setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const handleDeploy = async () => {
        const token = getToken();
        if (!token) { setMsg({ text: 'Enter and save your GitHub token first.', type: 'error' }); return; }
        setDeploying(true);
        setMsg({ text: '', type: '' });
        try {
            const state = store.getState();
            const data = { profile: state.profile, skills: state.skills, projects: state.projects, achievements: state.achievements, messages: state.messages };

            const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
            const headers = { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

            const existing = await fetch(url + `?ref=${BRANCH}`, { headers }).then((r) => r.json());
            const sha = existing.sha;
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + '\n')));

            const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ message: 'Update portfolio data via admin panel', content, sha, branch: BRANCH }) });

            if (!res.ok) { const err = await res.json(); throw new Error(err.message); }

            setMsg({ text: 'Deployed! Vercel will auto-redeploy in ~30s.', type: 'success' });
        } catch (e) {
            setMsg({ text: 'Error: ' + e.message, type: 'error' });
        }
        setDeploying(false);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#18112E]">Deploy to Production</h2>
            <p className="text-sm text-neutral-500 font-medium">Push your changes to GitHub. Vercel will auto-redeploy so all users see the updates.</p>

            <div className="bg-[#F8F9FA] border border-neutral-200 rounded-[16px] p-5 space-y-4">
                <div>
                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">GitHub Personal Access Token</label>
                    <div className="flex gap-2">
                        <input type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="ghp_... or github_pat_..." className="flex-1 bg-white border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                        <button onClick={saveToken} className="bg-[#18112E] text-white px-5 py-3 rounded-[12px] text-sm font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-all">Save</button>
                    </div>
                    <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 underline mt-1.5 inline-block">Generate a classic token with repo scope</a>
                </div>

                <div className="pt-2 border-t border-neutral-200">
                    <button onClick={handleDeploy} disabled={deploying || !getToken()} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-6 py-3 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all disabled:opacity-50 shadow-md">
                        <Upload className="w-5 h-5" /> {deploying ? 'Deploying to GitHub...' : 'Deploy to Production'}
                    </button>
                    <p className="text-[11px] text-neutral-400 mt-2">Commits to <span className="font-mono">{REPO}/{FILE_PATH}</span> on <span className="font-mono">{BRANCH}</span>. Vercel redeploys automatically.</p>
                </div>
            </div>

            <hr className="border-neutral-200" />

            <h2 className="text-xl font-bold text-[#18112E]">Music Player</h2>
            <p className="text-sm text-neutral-500 font-medium">Set a song for the admin panel — paste a URL or upload a file.</p>

            <div className="bg-[#F8F9FA] border border-neutral-200 rounded-[16px] p-5 space-y-4">
                <div>
                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Song Name</label>
                    <input type="text" defaultValue={getMusicName()} onChange={(e) => { setMusicName(e.target.value); window.location.reload(); }} placeholder="My Song" className="w-full bg-white border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                </div>
                <div>
                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Audio URL or Upload (YouTube not supported for audio)</label>
                    <div className="flex gap-2">
                        <input type="text" defaultValue={getMusicUrl()} onChange={(e) => { setMusicUrl(e.target.value); window.location.reload(); }} placeholder="https://example.com/song.mp3" className="flex-1 bg-white border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                        <label className="flex items-center gap-1.5 px-4 bg-[#18112E] text-white rounded-[12px] text-xs font-bold cursor-pointer hover:bg-[#FFB800] hover:text-[#18112E] transition-all whitespace-nowrap">
                            <UploadCloud className="w-4 h-4" /> Upload
                            <input type="file" accept="audio/*" className="hidden" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const r = new FileReader();
                                r.onload = () => { setMusicUrl(r.result); window.location.reload(); };
                                r.readAsDataURL(f);
                            }} />
                        </label>
                    </div>
                </div>
                {getMusicUrl() && (
                    <div className="flex items-center gap-3 text-sm text-green-600 font-medium">
                        <Music className="w-4 h-4" /> Song set — player appears bottom-right.
                    </div>
                )}
            </div>

            <hr className="border-neutral-200" />

            <h2 className="text-xl font-bold text-[#18112E]">Background</h2>
            <p className="text-sm text-neutral-500 font-medium">Set a background image or video — paste a URL or upload a file.</p>

            <div className="bg-[#F8F9FA] border border-neutral-200 rounded-[16px] p-5 space-y-4">
                <div>
                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Background Image — URL or Upload</label>
                    <div className="flex gap-2">
                        <input type="text" defaultValue={getBgImg()} onChange={(e) => { setBgImg(e.target.value); window.location.reload(); }} placeholder="https://example.com/bg.jpg" className="flex-1 bg-white border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                        <label className="flex items-center gap-1.5 px-4 bg-[#18112E] text-white rounded-[12px] text-xs font-bold cursor-pointer hover:bg-[#FFB800] hover:text-[#18112E] transition-all whitespace-nowrap">
                            <UploadCloud className="w-4 h-4" /> Upload
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const r = new FileReader();
                                r.onload = () => { setBgImg(r.result); window.location.reload(); };
                                r.readAsDataURL(f);
                            }} />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-bold text-[#18112E] block mb-1.5">Background Video — URL or Upload (YouTube supported!)</label>
                    <div className="flex gap-2">
                        <input type="text" defaultValue={getBgVid()} onChange={(e) => { setBgVid(e.target.value); window.location.reload(); }} placeholder="https://youtube.com/watch?v=... or https://example.com/bg.mp4" className="flex-1 bg-white border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                        <label className="flex items-center gap-1.5 px-4 bg-[#18112E] text-white rounded-[12px] text-xs font-bold cursor-pointer hover:bg-[#FFB800] hover:text-[#18112E] transition-all whitespace-nowrap">
                            <UploadCloud className="w-4 h-4" /> Upload
                            <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (!f) return;
                                const r = new FileReader();
                                r.onload = () => { setBgVid(r.result); window.location.reload(); };
                                r.readAsDataURL(f);
                            }} />
                        </label>
                    </div>
                </div>
                {(getBgImg() || getBgVid()) && (
                    <div className="flex items-center gap-3 text-sm text-green-600 font-medium">
                        <ImageIcon className="w-4 h-4" /> Background set — toggle it from the floating buttons (bottom-left).
                    </div>
                )}
            </div>

            <hr className="border-neutral-200" />

            <h2 className="text-xl font-bold text-[#18112E]">Admin Password</h2>
            <p className="text-sm text-neutral-500 font-medium">The password is hardcoded — change it in <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-xs">AdminPanel.jsx</code> (look for <code className="bg-neutral-200 px-1.5 py-0.5 rounded text-xs">ADMIN_PASSWORD</code>) and redeploy. Current password works on all devices.</p>

            {msg.text && (
                <div className={`rounded-[12px] p-4 text-sm font-bold ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    {msg.text}
                </div>
            )}
        </div>
    );
}

function MusicBar() {
    const url = getMusicUrl();
    const name = getMusicName() || 'Music';
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    if (!url) return null;

    const toggle = () => {
        if (!audioRef.current) {
            audioRef.current = new Audio(url);
            audioRef.current.loop = true;
        }
        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {});
        }
        setPlaying(!playing);
    };

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 bg-white border-2 border-[#18112E] rounded-[16px] px-4 py-3 shadow-[4px_4px_0_#18112E] transition-all ${playing ? 'bg-[#FFB800]' : ''}`}>
            <button onClick={toggle} className="w-9 h-9 rounded-[10px] bg-[#18112E] text-white flex items-center justify-center hover:bg-[#FFB800] hover:text-[#18112E] transition-all">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <span className="text-sm font-bold text-[#18112E] max-w-[120px] truncate">{name}</span>
        </div>
    );
}

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showBg, setShowBg] = useState(true);
    const [showMusic, setShowMusic] = useState(true);

    return (
        <PasswordGate>
        <div className="min-h-screen bg-[#F8F9FA] font-sans relative">
            {showBg && getBgVid() && (isYoutubeUrl(getBgVid()) ? (
                <iframe src={getYoutubeEmbed(getBgVid())} className="fixed inset-0 w-full h-full z-0 pointer-events-none" allow="autoplay; fullscreen" />
            ) : (
                <video src={getBgVid()} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0" />
            ))}
            {showBg && getBgImg() && !getBgVid() && <div className="fixed inset-0 bg-cover bg-center z-0" style={{ backgroundImage: `url(${getBgImg()})` }} />}
            <div className="relative z-10">
            <header className="h-[60px] bg-white/90 backdrop-blur border-b border-neutral-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <span className="text-lg font-extrabold tracking-tight text-[#18112E]">Admin<span className="text-[#FFB800]">.</span></span>
                <a href="/" className="text-xs font-bold text-neutral-500 hover:text-[#18112E] transition-colors">View Site</a>
            </header>

            <div className="max-w-[1200px] mx-auto p-4 md:p-8">
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#18112E] tracking-tight">Control Panel</h1>
                        <p className="text-neutral-500 mt-1 font-medium text-sm">Manage your portfolio — no database needed.</p>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-6">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all whitespace-nowrap shrink-0 ${isActive ? 'bg-[#FFB800] text-[#18112E] shadow-md' : 'bg-white/90 backdrop-blur text-neutral-500 border border-neutral-100 hover:border-[#FFB800] hover:text-[#18112E]'}`}>
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }}>
                    <div className="bg-white/95 backdrop-blur border border-neutral-100 rounded-[20px] p-6 shadow-sm">
                        {activeTab === 'profile' && <ProfileTab />}
                        {activeTab === 'skills' && <SkillsTab />}
                        {activeTab === 'projects' && <ProjectsTab />}
                        {activeTab === 'achievements' && <AchievementsTab />}
                        {activeTab === 'messages' && <MessagesTab />}
                        {activeTab === 'settings' && <SettingsTab />}
                    </div>
                </motion.div>
            </div>
            {showMusic && <MusicBar />}
            <div className="fixed bottom-4 left-4 z-50 flex gap-2">
                <button onClick={() => setShowBg(!showBg)} className="w-10 h-10 rounded-[12px] bg-white border-2 border-[#18112E] shadow-[2px_2px_0_#18112E] flex items-center justify-center hover:bg-[#FFB800] transition-all text-[#18112E]" title="Toggle Background">
                    {showBg ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => setShowMusic(!showMusic)} className="w-10 h-10 rounded-[12px] bg-white border-2 border-[#18112E] shadow-[2px_2px_0_#18112E] flex items-center justify-center hover:bg-[#FFB800] transition-all text-[#18112E]" title="Toggle Music">
                    {showMusic ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
            </div>
            </div>
        </div>
        </PasswordGate>
    );
}
