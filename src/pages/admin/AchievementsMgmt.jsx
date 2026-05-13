import { useState, useRef } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Pencil, Trash2, X, Award, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyAchievement = { title: '', date: '', description: '', imageUrl: '' };

export default function AchievementsMgmt() {
    const achievements = useStore((s) => s.achievements);
    const addAchievement = useStore((s) => s.addAchievement);
    const updateAchievement = useStore((s) => s.updateAchievement);
    const deleteAchievement = useStore((s) => s.deleteAchievement);
    const uploadImage = useStore((s) => s.uploadImage);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyAchievement);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const openNew = () => { setEditing(null); setForm(emptyAchievement); setModalOpen(true); };
    const openEdit = (a) => { setEditing(a.id); setForm({ title: a.title, date: a.date || '', description: a.description || '', imageUrl: a.imageUrl || '' }); setModalOpen(true); };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const { url, error } = await uploadImage(file);
        if (!error && url) {
            setForm((prev) => ({ ...prev, imageUrl: url }));
        } else {
            alert("Image upload failed");
        }
        setUploading(false);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        if (editing) await updateAchievement(editing, form);
        else await addAchievement(form);
        setModalOpen(false);
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-2xl md:text-4xl font-bold text-[#18112E] tracking-tight">Milestones</h1>
                    <p className="text-neutral-500 mt-1 md:mt-2 font-medium text-sm md:text-base">Platform certifications and major awards.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-6 py-3.5 rounded-[16px] font-bold hover:bg-[#ffcc33] transition-all shadow-md active:scale-95 z-10"
                >
                    <Plus className="w-5 h-5" />
                    <span>Log Milestone</span>
                </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {achievements.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white border border-neutral-100 rounded-[20px] md:rounded-[32px] p-5 md:p-8 group hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-[#FFB800] transition-all relative overflow-hidden flex flex-col justify-between min-h-[180px] md:min-h-[220px]"
                    >
                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className="w-14 h-14 bg-[#F8F9FA] rounded-[20px] shadow-sm flex items-center justify-center group-hover:bg-[#FFB800] transition-colors border border-neutral-100">
                                <Award className="w-7 h-7 text-[#18112E]" />
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEdit(item)} className="text-[#18112E] hover:bg-neutral-100 transition-colors p-2 bg-[#F8F9FA] rounded-[12px]"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => deleteAchievement(item.id)} className="text-red-500 hover:bg-red-50 transition-colors p-2 bg-[#F8F9FA] rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <div>
                            {item.date && (
                                <div className="inline-block px-3 py-1 bg-[#F8F9FA] border border-neutral-100 text-[#18112E] text-xs font-bold uppercase rounded-[8px] mb-3">
                                    {item.date}
                                </div>
                            )}
                            <h3 className="text-[#18112E] font-extrabold text-2xl leading-tight">
                                {item.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {achievements.length === 0 && (
                <div className="text-center py-24 text-neutral-400 font-bold bg-white rounded-[32px] border border-neutral-100 border-dashed">
                    No records found in database.
                </div>
            )}

            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-0 md:p-4" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-t-[24px] md:rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                            <div className="flex items-center justify-between p-5 md:p-8 border-b border-neutral-100 bg-[#F8F9FA]">
                                <h2 className="text-lg md:text-2xl font-bold text-[#18112E] flex items-center gap-3">
                                    <div className="w-3 h-3 bg-[#FFB800] rounded-full" />
                                    {editing ? 'Update Milestone' : 'New Milestone'}
                                </h2>
                                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-2 rounded-full border border-neutral-100 shadow-sm transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-5 md:p-8 space-y-5 md:space-y-6 overflow-y-auto max-h-[60vh]">
                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Achievement Image</label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-24 h-24 rounded-2xl bg-[#F8F9FA] border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {form.imageUrl ? (
                                                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-8 h-8 text-neutral-400 group-hover:text-[#FFB800] transition-colors" />
                                            )}
                                            {uploading && (
                                                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                    <div className="w-5 h-5 border-2 border-[#18112E] border-t-transparent rounded-full animate-spin" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                className="flex items-center gap-2 px-4 py-2 bg-[#F8F9FA] hover:bg-neutral-200 border border-neutral-200 rounded-xl text-sm font-bold text-[#18112E] transition-colors"
                                            >
                                                <UploadCloud className="w-4 h-4" /> Upload File
                                            </button>
                                            <input
                                                placeholder="Or paste image URL"
                                                value={form.imageUrl}
                                                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                                className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-xl px-4 py-2 text-sm text-[#18112E] font-medium transition-all focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Designation / Title</label>
                                    <input placeholder="Achievement Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Timestamp</label>
                                    <input placeholder="Date / Year" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Description</label>
                                    <textarea placeholder="Details about this milestone..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full min-h-[100px] resize-none bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                </div>
                            </div>

                            <div className="p-5 md:p-8 border-t border-neutral-100 bg-white flex gap-3 md:gap-4">
                                <button onClick={() => setModalOpen(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-4 rounded-[16px] hover:bg-neutral-200 transition-colors">Cancel</button>
                                <button onClick={handleSave} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-4 rounded-[16px] hover:bg-[#ffcc33] transition-colors shadow-md">
                                    {editing ? 'Commit Data' : 'Authorize Log'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
