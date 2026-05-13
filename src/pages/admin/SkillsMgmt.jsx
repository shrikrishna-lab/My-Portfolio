import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

const emptySkill = { name: '', icon: 'Code', category: 'Frontend' };
const categories = ['Frontend', 'Backend', 'Tools'];
const popularIcons = ['Code', 'Server', 'Database', 'Brush', 'Terminal', 'Globe', 'Smartphone', 'Cloud', 'Shield', 'Cpu', 'GitBranch', 'Layers', 'Box', 'Figma', 'Chrome'];

export default function SkillsMgmt() {
    const skills = useStore((s) => s.skills);
    const addSkill = useStore((s) => s.addSkill);
    const updateSkill = useStore((s) => s.updateSkill);
    const deleteSkill = useStore((s) => s.deleteSkill);

    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptySkill);
    const [saving, setSaving] = useState(false);

    const openNew = () => { setEditing(null); setForm(emptySkill); setModalOpen(true); };
    const openEdit = (skill) => {
        setEditing(skill.id);
        setForm({ name: skill.name, icon: skill.icon, category: skill.category });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.name.trim()) return;
        setSaving(true);
        if (editing) await updateSkill(editing, form);
        else await addSkill(form);
        setSaving(false);
        setModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        await deleteSkill(id);
    };

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-4xl font-bold text-[#18112E] tracking-tight">Skills Graph</h1>
                    <p className="text-neutral-500 mt-2 font-medium">Configure active technical capabilities.</p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 bg-[#FFB800] text-[#18112E] px-6 py-3.5 rounded-[16px] font-bold hover:bg-[#ffcc33] transition-all shadow-md active:scale-95 z-10"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Skill Node</span>
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white border border-neutral-100 rounded-[32px] overflow-hidden shadow-sm relative">
                <table className="w-full text-sm font-sans border-collapse">
                    <thead>
                        <tr className="border-b border-neutral-100 text-[#18112E] bg-[#F8F9FA] text-left text-xs uppercase font-extrabold tracking-widest">
                            <th className="px-8 py-5">Node Icon</th>
                            <th className="px-8 py-5">Identifier</th>
                            <th className="px-8 py-5 hidden sm:table-cell">Sector</th>
                            <th className="px-8 py-5 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((skill) => {
                            const IconComponent = LucideIcons[skill.icon] || LucideIcons.Code;
                            return (
                                <tr key={skill.id} className="border-b border-neutral-50 hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-[16px] border border-neutral-100 shadow-sm group-hover:border-[#FFB800] group-hover:text-[#FFB800] transition-colors text-[#18112E]">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-[#18112E] font-bold text-lg">
                                        {skill.name}
                                    </td>
                                    <td className="px-8 py-4 hidden sm:table-cell">
                                        <span className="text-xs font-bold px-3 py-1.5 bg-[#F8F9FA] border border-neutral-100 text-[#18112E] rounded-[8px] uppercase">
                                            {skill.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(skill)} className="text-[#18112E] hover:bg-[#FFB800] transition-colors p-2.5 bg-white shadow-sm border border-neutral-100 rounded-[12px]"><Pencil className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(skill.id)} className="text-red-500 hover:bg-red-50 transition-colors p-2.5 bg-white shadow-sm border border-neutral-100 rounded-[12px]"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {skills.length === 0 && <div className="text-center py-24 text-neutral-400 font-bold bg-[#F8F9FA] rounded-[32px] border border-neutral-100 border-dashed m-1">No active technical nodes.</div>}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#18112E]/40 backdrop-blur-sm p-4" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>

                            <div className="flex items-center justify-between p-8 border-b border-neutral-100 bg-[#F8F9FA]">
                                <h2 className="text-2xl font-bold text-[#18112E] flex items-center gap-3">
                                    <div className="w-3 h-3 bg-[#FFB800] rounded-full" />
                                    {editing ? 'Modify Node' : 'Initialize Node'}
                                </h2>
                                <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-[#18112E] bg-white p-2 rounded-full border border-neutral-100 shadow-sm transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-8 space-y-8 overflow-y-auto">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-[#18112E]">Skill Title</label>
                                    <input placeholder="React, Node.js..." value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-medium transition-all focus:outline-none" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#18112E]">Sector Classification</label>
                                    <div className="flex gap-3">
                                        {categories.map((cat) => (
                                            <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={`flex-1 py-3 text-sm font-bold rounded-[12px] transition-all border-2 ${form.category === cat ? 'bg-white border-[#FFB800] text-[#18112E] shadow-sm' : 'bg-[#F8F9FA] text-neutral-500 border-transparent hover:border-neutral-200'}`}>
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-[#18112E]">Visual Node Symbol</label>
                                    <div className="flex flex-wrap gap-3 max-h-[180px] overflow-y-auto custom-scrollbar pt-1">
                                        {popularIcons.map((iconName) => {
                                            const IC = LucideIcons[iconName] || LucideIcons.Code;
                                            return (
                                                <button key={iconName} onClick={() => setForm({ ...form, icon: iconName })} className={`w-14 h-14 rounded-[16px] flex items-center justify-center transition-all border-2 ${form.icon === iconName ? 'bg-white text-[#FFB800] border-[#FFB800] shadow-md' : 'bg-[#F8F9FA] text-neutral-400 border-transparent hover:border-neutral-200 hover:text-[#18112E]'}`}>
                                                    <IC className="w-6 h-6" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-neutral-100 bg-white flex gap-4">
                                <button onClick={() => setModalOpen(false)} className="flex-1 bg-[#F8F9FA] text-[#18112E] font-bold py-4 rounded-[16px] hover:bg-neutral-200 transition-colors">Cancel</button>
                                <button onClick={handleSave} disabled={saving} className="flex-1 bg-[#FFB800] text-[#18112E] font-bold py-4 rounded-[16px] hover:bg-[#ffcc33] transition-colors disabled:opacity-50 shadow-md">
                                    {saving ? 'Transmitting...' : editing ? 'Update Link' : 'Register Link'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
