import { useState, useRef, useEffect, useMemo } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import {
    Shield, User, Sparkles, FolderKanban, Award, MessageSquare, Settings, RefreshCw,
    Plus, Pencil, Trash2, X, Save, Image as ImageIcon, Music, Play, Pause, Eye, EyeOff, VolumeX, AlertCircle,
    Github, ExternalLink, UploadCloud, Check, Upload, ChevronDown, SkipBack, SkipForward
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const REPO = 'shrikrishna-lab/My-Portfolio';
const FILE_PATH = 'public/data.json';
const BRANCH = 'main';
const TOKEN_KEY = 'github_token';
const ADMIN_PASSWORD = 'admin123';
const BG_IMG_KEY = 'bg_image';
const BG_VID_KEY = 'bg_video';
const PLAYLIST_KEY = 'music_playlist';
const PLAY_IDX_KEY = 'music_play_index';

function getToken() { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } }
function getBgImg() { try { return localStorage.getItem(BG_IMG_KEY) || ''; } catch { return ''; } }
function getBgVid() { try { return localStorage.getItem(BG_VID_KEY) || ''; } catch { return ''; } }
function getPlaylist() { try { return JSON.parse(localStorage.getItem(PLAYLIST_KEY)) || []; } catch { return []; } }
function setPlaylist(list) { try { localStorage.setItem(PLAYLIST_KEY, JSON.stringify(list)); } catch {} }
function getPlayIndex() { try { return parseInt(localStorage.getItem(PLAY_IDX_KEY)) || 0; } catch { return 0; } }
function setPlayIndex(i) { try { localStorage.setItem(PLAY_IDX_KEY, String(i)); } catch {} }
// Migrate old single-song storage to playlist
function migratePlaylist() {
    if (getPlaylist().length > 0) return;
    const oldUrl = (() => { try { return localStorage.getItem('music_url') || ''; } catch { return ''; } })();
    const oldName = (() => { try { return localStorage.getItem('music_name') || ''; } catch { return ''; } })();
    if (oldUrl) {
        setPlaylist([{ name: oldName || 'Music', url: oldUrl }]);
        try { localStorage.removeItem('music_url'); localStorage.removeItem('music_name'); } catch {}
    }
}
function isYoutubeUrl(url) { return !!url && /(?:youtube\.com\/(?:watch|embed|shorts)|youtu\.be\/)/i.test(url); }
function isSpotifyUrl(url) { return !!url && /spotify\.com\/(?:track|album|playlist|episode|show)\//i.test(url); }
function getYoutubeVideoId(url) {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) return parsed.pathname.split('/').filter(Boolean)[0] || '';
    if (parsed.searchParams.get('v')) return parsed.searchParams.get('v') || '';
    const pathParts = parsed.pathname.split('/').filter(Boolean);
    const shortsIndex = pathParts.indexOf('shorts');
    if (shortsIndex >= 0) return pathParts[shortsIndex + 1] || '';
    const embedIndex = pathParts.indexOf('embed');
    if (embedIndex >= 0) return pathParts[embedIndex + 1] || '';
  } catch {
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
  }
  return '';
}
function getYoutubeEmbed(url) {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&controls=0&loop=1&playlist=${id}&origin=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173')}` : '';
}
function getSpotifyEmbed(url) {
  if (!url) return '';
  try {
    if (url.startsWith('spotify:')) {
      const [, type, id] = url.split(':');
      return type && id ? `https://open.spotify.com/embed/${type}/${id}` : '';
    }
    const parsed = new URL(url);
    const match = parsed.pathname.match(/\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/i);
    return match ? `https://open.spotify.com/embed/${match[1].toLowerCase()}/${match[2]}?utm_source=generator` : '';
  } catch {
    const match = url.match(/spotify\.com\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/i);
    return match ? `https://open.spotify.com/embed/${match[1].toLowerCase()}/${match[2]}?utm_source=generator` : '';
  }
}
function getMusicProvider(url) {
  if (isYoutubeUrl(url)) return 'youtube';
  if (isSpotifyUrl(url)) return 'spotify';
  return 'audio';
}
function getThumbnailUrl(url) {
  if (isYoutubeUrl(url)) {
    const id = getYoutubeVideoId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }
  return '';
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
            setForm({ ...profile }); // eslint-disable-line react-hooks/set-state-in-effect
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
    const [, setUploading] = useState(false);
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
    const fetchMessagesFromGitHub = useStore((s) => s.fetchMessagesFromGitHub);
    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        await fetchMessagesFromGitHub();
        setSyncing(false);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-[#18112E]">Messages ({messages.length})</h2>
                <button onClick={handleSync} disabled={syncing} className="flex items-center gap-2 bg-[#18112E] text-white px-4 py-2 rounded-[12px] text-xs font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-all disabled:opacity-50">
                    <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} /> {syncing ? 'Syncing...' : 'Sync'}
                </button>
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
        <div className="min-h-screen flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {getBgVid() && (isYoutubeUrl(getBgVid()) ? <iframe src={getYoutubeEmbed(getBgVid())} className="fixed inset-0 w-full h-full z-0 pointer-events-none" allow="autoplay; fullscreen" title="bg" /> : <video src={getBgVid()} autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0" />)}
            {getBgImg() && !getBgVid() && <img src={getBgImg()} className="fixed inset-0 w-full h-full object-cover z-0" alt="" />}
            {!getBgVid() && !getBgImg() && <div className="fixed inset-0 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb]" />}
            {(getBgVid() || getBgImg()) && <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[1]" />}
            <form onSubmit={handleSubmit} className="relative z-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-[24px] p-8 shadow-2xl shadow-black/10 w-full max-w-sm space-y-6">
                <div className="text-center">
                    <div className="w-14 h-14 bg-[#FFB800]/80 backdrop-blur rounded-[16px] flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Shield className="w-7 h-7 text-[#18112E]" />
                    </div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-sm">Admin Access</h1>
                    <p className="text-sm text-white/70 font-medium mt-1">Enter the admin password to continue.</p>
                </div>
                {error && (
                    <div className="p-3 bg-red-500/20 backdrop-blur text-red-200 rounded-[12px] text-sm font-bold text-center border border-red-500/20">{error}</div>
                )}
                <input type="password" placeholder="Password" value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-white/10 backdrop-blur border border-white/10 focus:border-[#FFB800]/50 focus:bg-white/20 rounded-[12px] px-4 py-3 text-center text-lg font-bold text-white placeholder-white/40 outline-none transition-all tracking-widest" autoFocus />
                <button type="submit" className="w-full bg-[#FFB800]/80 backdrop-blur text-[#18112E] font-bold py-3 rounded-[12px] hover:bg-[#FFB800] transition-all shadow-lg shadow-black/10">Unlock</button>
            </form>
        </div>
    );
}

function SettingsTab() {
    const [tokenInput, setTokenInput] = useState(getToken());
    const [playlist, setPlaylistState] = useState(() => getPlaylist());
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');
    const [bgImgInput, setBgImgInput] = useState(getBgImg());
    const [bgVidInput, setBgVidInput] = useState(getBgVid());
    const [deploying, setDeploying] = useState(false);
    const [msg, setMsg] = useState({ text: '', type: '' });

    const showMsg = (text, type = 'success') => {
        setMsg({ text, type });
        window.setTimeout(() => setMsg({ text: '', type: '' }), 3000);
    };

    const saveToken = () => {
        try { localStorage.setItem(TOKEN_KEY, tokenInput.trim()); } catch {}
        showMsg('Token saved.');
    };

    const saveAll = () => {
        setPlaylist(getPlaylist());
        window.location.reload();
    };

    const saveBackground = () => {
        try {
            localStorage.setItem(BG_IMG_KEY, bgImgInput.trim());
            localStorage.setItem(BG_VID_KEY, bgVidInput.trim());
        } catch {}
        window.location.reload();
    };

    const updatePlaylist = (list) => {
        setPlaylist(list);
        setPlaylistState([...list]);
    };

    const addSong = () => {
        if (!newUrl.trim()) return;
        const list = getPlaylist();
        list.push({ name: newName.trim() || 'Untitled', url: newUrl.trim() });
        updatePlaylist(list);
        setNewName('');
        setNewUrl('');
    };

    const removeSong = (i) => {
        const list = getPlaylist();
        list.splice(i, 1);
        updatePlaylist(list);
        if (getPlayIndex() >= list.length) setPlayIndex(0);
    };

    const moveSong = (i, dir) => {
        const to = i + dir;
        if (to < 0 || to >= playlist.length) return;
        const list = getPlaylist();
        [list[i], list[to]] = [list[to], list[i]];
        updatePlaylist(list);
    };

    const handleAudioUpload = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
            const list = getPlaylist();
            list.push({ name: f.name.replace(/\.[^.]+$/, ''), url: String(r.result || '') });
            setPlaylist(list);
        };
        r.readAsDataURL(f);
    };

    const handleImageUpload = (setter, storageKey) => (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
            const value = String(r.result || '');
            setter(value);
            try { localStorage.setItem(storageKey, value); } catch {}
            window.location.reload();
        };
        r.readAsDataURL(f);
    };

    const handleDeploy = async () => {
        const token = getToken();
        if (!token) { showMsg('Enter and save your GitHub token first.', 'error'); return; }
        setDeploying(true);
        setMsg({ text: '', type: '' });
        try {
            const state = useStore.getState();
            const data = { profile: state.profile, skills: state.skills, projects: state.projects, achievements: state.achievements, messages: state.messages };

            const url = `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`;
            const headers = { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

            const existing = await fetch(url + `?ref=${BRANCH}`, { headers }).then((r) => r.json());
            const sha = existing.sha;
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2) + '\n')));

            const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ message: 'Update portfolio data via admin panel', content, sha, branch: BRANCH }) });
            if (!res.ok) { const err = await res.json(); throw new Error(err.message); }

            showMsg('Deployed. Vercel will pick up the GitHub commit automatically.');
        } catch (e) {
            showMsg(`Error: ${e.message}`, 'error');
        }
        setDeploying(false);
    };

    const curIndex = getPlayIndex();

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-[#18112E] via-[#24194a] to-[#3d2b76] p-6 text-white shadow-xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                        <Shield className="h-3.5 w-3.5 text-[#FFB800]" /> Admin console
                    </div>
                    <h2 className="mt-4 text-2xl md:text-3xl font-black tracking-tight">Control panel</h2>
                    <p className="mt-2 max-w-2xl text-sm md:text-base text-white/70">
                        Manage the portfolio, media, and deployment settings from one place.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Deploy</div>
                        <div className="mt-2 text-lg font-black text-[#18112E]">GitHub</div>
                        <div className="text-xs text-neutral-500">Push updates to main</div>
                    </div>
                    <div className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Playlist</div>
                        <div className="mt-2 text-lg font-black text-[#18112E]">{playlist.length} songs</div>
                        <div className="text-xs text-neutral-500">Queue playback</div>
                    </div>
                    <div className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Content</div>
                        <div className="mt-2 text-lg font-black text-[#18112E]">{useStore.getState().projects.length + useStore.getState().skills.length}</div>
                        <div className="text-xs text-neutral-500">Projects + skills</div>
                    </div>
                    <div className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-sm">
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">Inbox</div>
                        <div className="mt-2 text-lg font-black text-[#18112E]">{useStore.getState().messages.length}</div>
                        <div className="text-xs text-neutral-500">New messages</div>
                    </div>
                </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-[24px] p-5 space-y-4 shadow-2xl shadow-black/10">
                <div>
                    <h2 className="text-xl font-bold text-white">Deploy to Production</h2>
                    <p className="text-sm text-white/70 font-medium">Push your changes to GitHub. Vercel redeploys automatically after the commit lands.</p>
                </div>
                <div className="bg-white rounded-[18px] p-5 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-[#18112E] block mb-1.5">GitHub Personal Access Token</label>
                        <div className="flex gap-2">
                            <input type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder="ghp_... or github_pat_..." className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                            <button onClick={saveToken} className="bg-[#18112E] text-white px-5 py-3 rounded-[12px] text-sm font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-all">Save</button>
                        </div>
                        <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-[11px] text-blue-600 underline mt-1.5 inline-block">Generate a classic token with repo scope</a>
                    </div>
                    <div className="pt-2 border-t border-neutral-200">
                        <button onClick={handleDeploy} disabled={deploying || !getToken()} className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-6 py-3 rounded-[12px] font-bold hover:bg-[#ffcc33] transition-all disabled:opacity-50 shadow-md">
                            <Upload className="w-5 h-5" /> {deploying ? 'Deploying to GitHub...' : 'Deploy to Production'}
                        </button>
                        <p className="text-[11px] text-neutral-400 mt-2">Commits to <span className="font-mono">{REPO}/{FILE_PATH}</span> on <span className="font-mono">{BRANCH}</span>.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-[#18112E]">Playlist ({playlist.length})</h2>
                            <p className="text-sm text-neutral-500 font-medium">Songs play in queue order. Add audio, YouTube, or Spotify URLs.</p>
                        </div>
                        <button onClick={saveAll} className="bg-[#FFB800] text-[#18112E] px-4 py-2.5 rounded-[12px] text-sm font-bold hover:bg-[#ffcc33] transition-all shadow-sm">
                            Save & reload
                        </button>
                    </div>
                    <div className="mt-5 space-y-3 max-h-[280px] overflow-y-auto">
                        {playlist.length === 0 && (
                            <div className="text-center py-8 text-neutral-400 text-sm font-bold">No songs yet. Add one below.</div>
                        )}
                        {playlist.map((s, i) => {
                            const prov = getMusicProvider(s.url);
                            const isCurrent = i === curIndex;
                            return (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-[14px] border transition-all ${isCurrent ? 'bg-[#FFB800]/10 border-[#FFB800]/40' : 'bg-[#F8F9FA] border-neutral-100'}`}>
                                    <div className="flex flex-col gap-0.5">
                                        <button onClick={() => moveSong(i, -1)} disabled={i === 0} className="text-neutral-400 hover:text-[#18112E] disabled:opacity-20 disabled:cursor-not-allowed"><ChevronDown className="w-3 h-3 -rotate-90" /></button>
                                        <button onClick={() => moveSong(i, 1)} disabled={i === playlist.length - 1} className="text-neutral-400 hover:text-[#18112E] disabled:opacity-20 disabled:cursor-not-allowed"><ChevronDown className="w-3 h-3 rotate-90" /></button>
                                    </div>
                                    <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-black ${isCurrent ? 'bg-[#FFB800] text-[#18112E]' : 'bg-white border border-neutral-100 text-neutral-400'}`}>
                                        {prov === 'youtube' ? 'YT' : prov === 'spotify' ? 'SP' : '♪'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${isCurrent ? 'text-[#18112E]' : 'text-neutral-600'}`}>{s.name}</p>
                                        <p className="text-[10px] text-neutral-400 font-medium truncate">{s.url}</p>
                                    </div>
                                    <button onClick={() => removeSong(i)} className="p-1.5 rounded-[8px] text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
                        <div className="flex gap-2">
                            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Song name" className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="Audio, YouTube or Spotify URL" className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                            <label className="flex items-center gap-1.5 px-4 bg-[#18112E] text-white rounded-[12px] text-xs font-bold cursor-pointer hover:bg-[#FFB800] hover:text-[#18112E] transition-all whitespace-nowrap">
                                <UploadCloud className="w-4 h-4" /> Upload
                                <input type="file" accept="audio/*" className="hidden" onChange={handleAudioUpload} />
                            </label>
                        </div>
                        <button onClick={addSong} className="w-full bg-[#FFB800] text-[#18112E] py-3 rounded-[12px] text-sm font-bold hover:bg-[#ffcc33] transition-all shadow-sm">
                            <Plus className="w-4 h-4 inline mr-1.5" />Add to playlist
                        </button>
                    </div>
                </div>

                <div className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-sm">
                    <div>
                        <h2 className="text-xl font-bold text-[#18112E]">Background</h2>
                        <p className="text-sm text-neutral-500 font-medium">Set a background image or video — YouTube videos also render inline.</p>
                    </div>
                    <div className="mt-5 space-y-4">
                        <div>
                            <label className="text-xs font-bold text-[#18112E] block mb-1.5">Background Image URL</label>
                            <div className="flex gap-2">
                                <input type="text" value={bgImgInput} onChange={(e) => setBgImgInput(e.target.value)} placeholder="https://example.com/bg.jpg" className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                                <label className="flex items-center gap-1.5 px-4 bg-[#18112E] text-white rounded-[12px] text-xs font-bold cursor-pointer hover:bg-[#FFB800] hover:text-[#18112E] transition-all whitespace-nowrap">
                                    <UploadCloud className="w-4 h-4" /> Upload
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload(setBgImgInput, BG_IMG_KEY)} />
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-[#18112E] block mb-1.5">Background Video URL</label>
                            <div className="flex gap-2">
                                <input type="text" value={bgVidInput} onChange={(e) => setBgVidInput(e.target.value)} placeholder="https://youtube.com/watch?v=... or https://example.com/bg.mp4" className="flex-1 bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] rounded-[12px] px-4 py-3 text-sm font-medium outline-none transition-all" />
                                <label className="flex items-center gap-1.5 px-4 bg-[#18112E] text-white rounded-[12px] text-xs font-bold cursor-pointer hover:bg-[#FFB800] hover:text-[#18112E] transition-all whitespace-nowrap">
                                    <UploadCloud className="w-4 h-4" /> Upload
                                    <input type="file" accept="video/*" className="hidden" onChange={handleImageUpload(setBgVidInput, BG_VID_KEY)} />
                                </label>
                            </div>
                        </div>
                        <div className="flex items-center justify-between gap-3 rounded-[16px] border border-dashed border-neutral-200 bg-neutral-50 px-4 py-3">
                            <div className="flex items-center gap-2 text-sm font-medium text-neutral-600">
                                <ImageIcon className="w-4 h-4 text-[#FFB800]" />
                                Backgrounds update after save.
                            </div>
                            <button onClick={saveBackground} className="bg-[#FFB800] text-[#18112E] px-4 py-2.5 rounded-[12px] text-sm font-bold hover:bg-[#ffcc33] transition-all shadow-sm">
                                Save background
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-[20px] border border-neutral-200 bg-white p-4 shadow-sm">
                <h2 className="text-xl font-bold text-[#18112E]">Admin Password</h2>
                <p className="text-sm text-neutral-500 font-medium">The password is hardcoded in <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs">AdminPanel.jsx</code> via <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-xs">ADMIN_PASSWORD</code>.</p>
            </div>

            {msg.text && (
                <div className={`rounded-[12px] p-4 text-sm font-bold ${msg.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                    {msg.text}
                </div>
            )}
        </div>
    );
}

function fmt(t) {
    if (!t || !isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function MusicBar() {
    const [playlist] = useState(() => getPlaylist());
    const [index, setIndexState] = useState(() => getPlayIndex());
    const [playing, setPlaying] = useState(false);
    const [error, setError] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [seeking, setSeeking] = useState(false);
    const audioRef = useRef(null);
    const ytPlayerRef = useRef(null);
    const ytTimer = useRef(null);
    const barRef = useRef(null);

    migratePlaylist();

    const song = playlist[index] || null;
    const provider = song ? getMusicProvider(song.url) : null;
    const embedUrl = provider === 'spotify' ? getSpotifyEmbed(song?.url) : '';
    const thumb = provider === 'youtube' ? getThumbnailUrl(song?.url) : '';
    const stars = useMemo(() => Array.from({ length: 28 }, (_, i) => ({
        left: `${(i * 3.7 + 1.2) % 100}%`,
        top: `${(i * 7.1 + 2.3) % 80 + 10}%`,
        delay: `${(i * 0.43) % 4}s`,
        size: `${(i % 3 + 1) * 1.5}px`,
        duration: `${2 + (i % 5) * 0.8}s`,
    })), []);
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const changeSong = (newIndex) => {
        if (playlist.length === 0) return;
        if (newIndex < 0) newIndex = playlist.length - 1;
        if (newIndex >= playlist.length) newIndex = 0;
        const newSong = playlist[newIndex];
        if (!newSong) return;
        setIndexState(newIndex);
        setPlayIndex(newIndex);
        setError(false);
        setCurrentTime(0);
        setDuration(0);
        setPlaying(false);
        const newProvider = getMusicProvider(newSong.url);
        if (newProvider === 'youtube' && ytPlayerRef.current) {
            const id = getYoutubeVideoId(newSong.url);
            if (id) { ytPlayerRef.current.loadVideoById(id); ytPlayerRef.current.playVideo(); }
        } else if (newProvider === 'audio' && audioRef.current) {
            audioRef.current.src = newSong.url;
            audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
        }
    };

    const next = () => changeSong(index + 1);
    const prev = () => changeSong(index - 1);
    const nextRef = useRef(next);
    useEffect(() => { nextRef.current = next; });

    const seek = (clientX) => {
        if (!barRef.current || duration <= 0) return;
        const rect = barRef.current.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const seekTime = pct * duration;
        setCurrentTime(seekTime);
        if (provider === 'youtube' && ytPlayerRef.current) ytPlayerRef.current.seekTo(seekTime, true);
        if (provider === 'audio' && audioRef.current) audioRef.current.currentTime = seekTime;
    };

    const handleBarDown = (e) => { setSeeking(true); seek(e.clientX || e.touches?.[0]?.clientX); };
    const handleBarMove = (e) => { if (seeking) seek(e.clientX || e.touches?.[0]?.clientX); };

    useEffect(() => {
        if (!seeking) return;
        const up = () => setSeeking(false);
        window.addEventListener('mouseup', up);
        window.addEventListener('touchend', up);
        return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up); };
    }, [seeking]);

    useEffect(() => {
        if (provider !== 'audio' || !audioRef.current) return;
        const el = audioRef.current;
        const update = () => { if (!seeking) { setCurrentTime(el.currentTime); setDuration(el.duration || 0); } };
        el.addEventListener('timeupdate', update);
        el.addEventListener('loadedmetadata', () => setDuration(el.duration || 0));
        return () => el.removeEventListener('timeupdate', update);
    }, [provider, song?.url, seeking]);

    useEffect(() => {
        if (provider !== 'youtube' || !ytPlayerRef.current) return;
        if (playing && !seeking) {
            ytTimer.current = setInterval(() => {
                const p = ytPlayerRef.current;
                if (p && p.getCurrentTime) { setCurrentTime(p.getCurrentTime()); setDuration(p.getDuration() || 0); }
            }, 250);
        }
        return () => { if (ytTimer.current) { clearInterval(ytTimer.current); ytTimer.current = null; } };
    }, [provider, playing, seeking]);

    useEffect(() => {
        if (!song || provider !== 'youtube' || ytPlayerRef.current) return;
        const id = getYoutubeVideoId(song.url);
        if (!id) return;
        const initPlayer = () => {
            if (ytPlayerRef.current) return;
            ytPlayerRef.current = new YT.Player('yt-player', {
                height: 0, width: 0,
                videoId: id,
                playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1, playsinline: 1, loop: 0 },
                events: {
                    onReady: () => { ytPlayerRef.current?.setVolume(100); },
                    onStateChange: (e) => {
                        if (e.data === YT.PlayerState.PLAYING) setPlaying(true);
                        else if (e.data === YT.PlayerState.PAUSED) setPlaying(false);
                        else if (e.data === YT.PlayerState.ENDED) { setPlaying(false); setCurrentTime(0); nextRef.current(); }
                    },
                    onError: () => setError(true),
                },
            });
        };
        if (window.YT?.Player) initPlayer();
        else {
            window.onYouTubeIframeAPIReady = initPlayer;
            if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
                const tag = document.createElement('script');
                tag.src = 'https://www.youtube.com/iframe_api';
                document.head.appendChild(tag);
            }
        }
        return () => {
            if (ytTimer.current) { clearInterval(ytTimer.current); ytTimer.current = null; }
            if (ytPlayerRef.current) { try { ytPlayerRef.current.destroy(); } catch {} ytPlayerRef.current = null; }
        };
    }, [provider, song?.url]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggle = () => {
        if (error) setError(false);
        if (provider === 'youtube' && ytPlayerRef.current) {
            const p = ytPlayerRef.current;
            if (p.getPlayerState?.() === YT.PlayerState.PLAYING) p.pauseVideo();
            else p.playVideo();
            return;
        }
        if (provider === 'spotify') { setPlaying((v) => !v); return; }
        const el = audioRef.current;
        if (!el) return;
        if (playing) { el.pause(); setPlaying(false); }
        else { el.play().then(() => setPlaying(true)).catch(() => { setError(true); setPlaying(false); }); }
    };

    if (!song) return null;

    const bars = [
        { h: 65, d: '0s' }, { h: 100, d: '0.12s' }, { h: 40, d: '0.24s' },
        { h: 85, d: '0.06s' }, { h: 55, d: '0.18s' }, { h: 90, d: '0.3s' },
    ];

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {provider === 'audio' && <audio ref={audioRef} src={song.url} preload="auto" onEnded={next} />}
            {provider === 'youtube' && <div id="yt-player" className="w-0 h-0 absolute opacity-0 pointer-events-none" />}

            {provider === 'spotify' && embedUrl && (
                <div className={playing && !error ? '' : 'hidden'}>
                    <iframe src={embedUrl} title="Spotify player" className="h-[152px] w-[320px] rounded-[16px]" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
                </div>
            )}

            <div className={`w-[320px] rounded-[20px] shadow-2xl shadow-black/20 overflow-hidden transition-all duration-300 ${expanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none absolute'} ${playing ? 'animate-pulse-glow border border-[#FFB800]/20' : 'bg-white/10 backdrop-blur-xl border border-white/20'}`}>
                {thumb && (
                    <div className="relative h-36 -mx-5 -mt-5 mb-4 overflow-hidden">
                        <img src={thumb} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#18112E]/90 via-[#18112E]/30 to-transparent" />
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/40 backdrop-blur rounded text-[10px] font-bold text-white/80 uppercase tracking-wider">
                            YouTube
                        </div>
                    </div>
                )}
                <div className={`p-5 pb-4 ${thumb ? 'pt-0' : ''} ${playing ? 'bg-gradient-to-br from-[#FFB800]/10 via-[#18112E]/60 to-[#18112E]/80 backdrop-blur-xl' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="relative">
                            {thumb ? (
                                <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${playing ? 'ring-[#FFB800]' : 'ring-white/20'}`}>
                                    <img src={thumb} alt="" className={`w-full h-full object-cover ${playing ? 'animate-disc-spin' : ''}`} />
                                </div>
                            ) : (
                                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center text-sm font-black transition-all duration-700 ${playing ? 'bg-[#FFB800] text-[#18112E] shadow-lg shadow-[#FFB800]/50 animate-pulse-glow' : 'bg-white/10 text-white/80'}`}>
                                    {provider === 'spotify' ? <Music className="w-5 h-5" /> : <Music className="w-5 h-5" />}
                                </div>
                            )}
                            {playing && !thumb && (
                                <span className="absolute -inset-1 rounded-[14px] border-2 border-transparent bg-gradient-to-r from-[#FFB800] via-[#ff8c00] to-[#FFB800] bg-[length:200%_100%] animate-shine -z-10 opacity-40" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate drop-shadow-sm">{song.name}</p>
                            <p className="text-[10px] text-white/50 font-medium flex items-center gap-1.5">
                                <span>{provider === 'youtube' ? 'YouTube' : provider === 'spotify' ? 'Spotify' : 'Audio'}</span>
                                <span className="w-1 h-1 rounded-full bg-white/30" />
                                <span>{index + 1}/{playlist.length}</span>
                            </p>
                        </div>
                        {playing && provider === 'audio' && (
                            <div className="flex items-end gap-[2px] h-6">
                                {bars.map((b, i) => (
                                    <span key={i} className="w-[3px] bg-[#FFB800] rounded-full animate-equalizer" style={{ height: `${b.h}%`, animationDelay: b.d }} />
                                ))}
                            </div>
                        )}
                    </div>

                    {provider !== 'spotify' && (
                        <div className="mb-3">
                            <div ref={barRef} className="relative h-4 group cursor-pointer py-1" onMouseDown={handleBarDown} onMouseMove={handleBarMove} onTouchStart={handleBarDown} onTouchMove={handleBarMove}>
                                {/* Track outer glow */}
                                <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-[#FFB800]/10 via-[#ff8c00]/5 to-transparent blur-xl opacity-50" style={{ width: `${Math.max(progress, 5)}%` }} />

                                {/* Track background - layered glass */}
                                <div className="absolute inset-y-0 left-0 right-0 rounded-full overflow-hidden">
                                    <div className="absolute inset-0 bg-white/[0.04] rounded-full" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />
                                </div>

                                {/* Tick marks */}
                                {[0, 1, 2, 3].map((t) => (
                                    <div key={t} className="absolute top-1/2 -translate-y-1/2 w-px h-1.5 bg-white/10 rounded-full" style={{ left: `${t * 33.33}%` }} />
                                ))}

                                {/* Filled progress with layered depth */}
                                <div className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-100 ease-linear overflow-visible" style={{ width: `${progress}%` }}>
                                    {/* Base glow layer */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FFB800] via-[#ff8c00] to-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.4)]" />
                                    {/* Inner highlight */}
                                    <div className="absolute inset-[2px] rounded-full bg-gradient-to-r from-white/30 via-white/10 to-transparent" />
                                    {/* Energy pulse */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" style={{ backgroundSize: '200% 100%' }} />

                                    {/* Thumb sphere */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                        <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,184,0,0.8)] scale-0 group-hover:scale-100 transition-all duration-300">
                                            <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-[#FFB800] to-[#ff8c00]" />
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine" style={{ backgroundSize: '200% 100%' }} />
                                        </div>
                                        {/* Ring ripple */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border border-[#FFB800]/30 scale-0 group-hover:scale-150 transition-all duration-500 animate-ping" />
                                    </div>
                                </div>

                                {/* Stars scattered along the bar */}
                                {stars.slice(0, 15).map((s, i) => (
                                    <div key={i} className="absolute rounded-full pointer-events-none" style={{
                                        left: s.left, top: `-${(i % 3 + 1) * 8}px`,
                                        width: s.size, height: s.size,
                                        background: i % 2 === 0 ? '#FFB800' : 'rgba(255,255,255,0.6)',
                                        animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite`,
                                        filter: 'blur(0.5px)',
                                    }} />
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-1.5 px-0.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-white/60 tabular-nums tracking-wide drop-shadow-[0_0_6px_rgba(255,184,0,0.1)]">{fmt(currentTime)}</span>
                                    <span className="text-white/10 text-[8px] font-medium">/</span>
                                    <span className="text-[9px] font-medium text-white/30 tabular-nums">{fmt(duration)}</span>
                                </div>
                                {playing && (
                                    <div className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-[#FFB800]/60 animate-pulse" />
                                        <span className="text-[8px] font-semibold text-white/30 uppercase tracking-[0.15em]">playing</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-1.5">
                        <button onClick={prev} disabled={playlist.length <= 1} className="w-9 h-9 rounded-[10px] bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 flex items-center justify-center active:scale-90" title="Previous">
                            <SkipBack className="w-4 h-4" />
                        </button>
                        <button onClick={toggle} className={`w-11 h-11 rounded-[14px] flex items-center justify-center transition-all active:scale-90 shadow-lg ${playing ? 'bg-[#FFB800] text-[#18112E] shadow-[#FFB800]/40 hover:bg-[#ffcc33] animate-pulse-glow' : 'bg-[#FFB800] text-[#18112E] hover:bg-[#ffcc33] shadow-black/20'}`}>
                            {error ? <AlertCircle className="w-5 h-5" /> : playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        </button>
                        <button onClick={next} disabled={playlist.length <= 1} className="w-9 h-9 rounded-[10px] bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-30 flex items-center justify-center active:scale-90" title="Next">
                            <SkipForward className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-1 h-8 ml-2 flex-1 justify-end">
                            {playing && !error && provider === 'audio' ? (
                                <span className="text-[10px] text-[#FFB800] font-semibold animate-pulse">LIVE</span>
                            ) : provider === 'audio' && !playing ? (
                                <span className="text-[10px] text-white/40 font-medium">Click to play</span>
                            ) : provider !== 'audio' ? (
                                <span className={`text-[10px] font-medium transition-colors ${playing ? 'text-[#FFB800]' : 'text-white/40'}`}>{playing ? 'Playing' : 'Paused'}</span>
                            ) : null}
                            {error && <span className="text-[10px] text-red-400 font-medium">Failed</span>}
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => setExpanded((v) => !v)} className={`flex items-center gap-3 rounded-full px-5 py-3 shadow-2xl shadow-black/10 transition-all duration-500 hover:-translate-y-1 ${playing ? 'bg-[#FFB800]/15 border border-[#FFB800]/30 backdrop-blur-xl animate-pulse-glow' : 'bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20'}`}>
                <div className="relative">
                    {playing && !error && <span className="absolute inset-0 rounded-full bg-[#FFB800] animate-ping opacity-40" />}
                    {thumb ? (
                        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20">
                            <img src={thumb} alt="" className={`w-full h-full object-cover ${playing ? 'animate-disc-spin' : ''}`} />
                        </div>
                    ) : (
                        <div className={`relative w-8 h-8 rounded-[10px] flex items-center justify-center text-xs font-black transition-all duration-700 ${playing ? 'bg-[#18112E] text-[#FFB800] animate-disc-spin' : 'bg-[#18112E] text-white'}`}>
                            {provider === 'spotify' ? 'SP' : '♪'}
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-start min-w-0">
                    <span className="text-sm font-bold truncate leading-tight transition-colors duration-500" style={{ color: playing ? '#FFB800' : 'white' }}>{error ? 'Error' : song.name}</span>
                    {playing && provider !== 'spotify' && (
                        <span className="text-[9px] text-white/40 font-medium tabular-nums">{fmt(currentTime)} / {fmt(duration)}</span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-all duration-300 ${expanded ? 'rotate-180' : ''}`} style={{ color: playing ? '#FFB800' : 'rgba(255,255,255,0.6)' }} />
            </button>
        </div>
    );
}

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('profile');
    const [showBg, setShowBg] = useState(true);
    const [showMusic, setShowMusic] = useState(true);
    const profile = useStore((s) => s.profile);
    const skillCount = useStore((s) => s.skills.length);
    const projectCount = useStore((s) => s.projects.length);
    const achievementCount = useStore((s) => s.achievements.length);
    const messageCount = useStore((s) => s.messages.length);

    const overviewCards = [
        { label: 'Profile', value: profile?.name || 'Ready', hint: profile?.title || 'Edit your intro' },
        { label: 'Content', value: String(projectCount + skillCount), hint: 'Projects + skills' },
        { label: 'Messages', value: String(messageCount), hint: 'Inbox activity' },
        { label: 'Awards', value: String(achievementCount), hint: 'Highlights' },
    ];

    return (
        <PasswordGate>
        <div className="min-h-screen font-sans relative">
            {getBgVid() && (isYoutubeUrl(getBgVid()) ? (
                <iframe src={getYoutubeEmbed(getBgVid())} className={`fixed inset-0 w-full h-full z-0 pointer-events-none transition-opacity duration-700 ${showBg ? 'opacity-100' : 'opacity-0'}`} allow="autoplay; fullscreen" title="bg" />
            ) : (
                <video src={getBgVid()} autoPlay loop muted playsInline className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${showBg ? 'opacity-100' : 'opacity-0'}`} onError={(e) => { e.target.style.display = 'none'; }} />
            ))}
            {getBgImg() && !getBgVid() && (
                <img src={getBgImg()} className={`fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-700 ${showBg ? 'opacity-100' : 'opacity-0'}`} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
            )}
            <div className={`fixed inset-0 z-0 bg-gradient-to-br from-[#667eea] via-[#764ba2] to-[#f093fb] transition-opacity duration-700 ${(!showBg || (!getBgVid() && !getBgImg())) ? 'opacity-100' : 'opacity-0'}`} />
            {(getBgVid() || getBgImg()) && <div className={`fixed inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-[1] transition-opacity duration-700 ${showBg ? 'opacity-100' : 'opacity-0'}`} />}
            <div className="relative z-10 min-h-screen">
                <header className="sticky top-0 z-50 border-b border-white/10 bg-white/10 backdrop-blur-sm shadow-lg shadow-black/5">
                    <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-4 md:px-8">
                        <span className="text-lg font-extrabold tracking-tight text-[#18112E] drop-shadow-sm">Admin<span className="text-[#FFB800]">.</span></span>
                        <a href="/" className="text-xs font-bold text-[#18112E]/60 hover:text-[#18112E] transition-colors">View Site</a>
                    </div>
                </header>

                <div className="mx-auto max-w-[1200px] space-y-6 p-4 md:p-8">
                    <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
                        <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/10 backdrop-blur-sm">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-white/80">
                                <Shield className="h-3.5 w-3.5 text-[#FFB800]" /> Admin dashboard
                            </div>
                            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">Manage content, media, and deployment.</h1>
                            <p className="mt-3 max-w-2xl text-sm md:text-base font-medium text-white/75">A cleaner workspace for editing profile data, media links, and site settings without leaving the panel.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {overviewCards.map((card) => (
                                <div key={card.label} className="rounded-[20px] border border-white/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm">
                                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">{card.label}</div>
                                    <div className="mt-2 text-lg font-black text-[#18112E]">{card.value}</div>
                                    <div className="text-xs text-neutral-500">{card.hint}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-sm font-bold transition-all whitespace-nowrap shrink-0 backdrop-blur-sm ${isActive ? 'bg-[#FFB800]/80 text-[#18112E] shadow-lg shadow-black/10' : 'bg-white/10 text-white/70 border border-white/10 hover:bg-white/20 hover:border-[#FFB800]/50 hover:text-white'}`}>
                                    <tab.icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                        <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur-sm md:p-6">
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
                    <button onClick={() => setShowBg(!showBg)} className="w-10 h-10 rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg shadow-black/10 flex items-center justify-center hover:bg-white/25 transition-all text-white/70 hover:text-white" title="Toggle Background">
                        {showBg ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setShowMusic(!showMusic)} className="w-10 h-10 rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/10 shadow-lg shadow-black/10 flex items-center justify-center hover:bg-white/25 transition-all text-white/70 hover:text-white" title="Toggle Music">
                        {showMusic ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
        </PasswordGate>
    );
}
