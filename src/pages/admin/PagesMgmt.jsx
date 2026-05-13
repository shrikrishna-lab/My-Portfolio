import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Save, Check, Blocks } from 'lucide-react';

export default function PagesMgmt() {
    const profile = useStore((s) => s.profile);
    const updateProfile = useStore((s) => s.updateProfile);
    const [form, setForm] = useState({});
    const [saved, setSaved] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Sync form with profile once loaded
    if (profile && !initialized) {
        setForm({ ...profile });
        setInitialized(true);
    }

    const handleSave = async () => {
        await updateProfile(form);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const Field = ({ label, field, multiline = false }) => {
        const value = form[field] || '';
        const onChange = (e) => setForm({ ...form, [field]: e.target.value });
        const inputClasses = "w-full bg-[#F8F9FA] border-2 border-transparent focus:border-[#FFB800] focus:bg-white rounded-[16px] px-5 py-4 text-[#18112E] font-semibold transition-all focus:outline-none placeholder-neutral-400";

        return (
            <div>
                <label className="text-sm font-extrabold text-[#18112E] mb-3 block">{label}</label>
                {multiline ? (
                    <textarea
                        rows={5}
                        value={value}
                        onChange={onChange}
                        className={`${inputClasses} resize-y min-h-[120px]`}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        className={inputClasses}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="space-y-8 max-w-4xl font-sans">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#18112E] tracking-tight">Content Studio</h1>
                    <p className="text-neutral-500 mt-2 font-medium">Manage all public-facing text and imagery.</p>
                </div>

                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-3 bg-[#18112E] text-white px-8 py-4 rounded-[16px] font-bold hover:bg-[#FFB800] hover:text-[#18112E] transition-colors shadow-lg shadow-[#18112E]/10"
                >
                    {saved ? <><Check className="w-5 h-5" /> Saved Successfully!</> : <><Save className="w-5 h-5" /> Publish Changes</>}
                </button>
            </div>

            <div className="grid gap-8">
                <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-8 shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-[16px] bg-[#F8F9FA] border border-neutral-100 flex items-center justify-center shadow-sm">
                            <Blocks className="w-6 h-6 text-[#18112E]" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#18112E]">Hero Identity</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Field label="Full Name" field="name" />
                        <Field label="Headline Title" field="title" />
                        <div className="md:col-span-2">
                            <Field label="Brief Introduction" field="intro" multiline />
                        </div>
                        <div className="md:col-span-2">
                            <Field label="3D Avatar or Hero Image URL" field="characterImage" />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#18112E] border-b border-neutral-100 pb-4">Personal Narrative</h2>
                    <Field label="About You" field="aboutStory" multiline />
                </div>

                <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#18112E] border-b border-neutral-100 pb-4">Startup Vision</h2>
                    <Field label="Mission Statement" field="startupVision" multiline />
                </div>

                <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-[#18112E] border-b border-neutral-100 pb-4">Social Connections</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Field label="Email Address" field="email" />
                        <Field label="GitHub Link" field="github" />
                        <Field label="LinkedIn Link" field="linkedin" />
                        <Field label="Twitter / X Link" field="twitter" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 pb-10">
                <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-3 bg-[#FFB800] text-[#18112E] px-10 py-5 rounded-[20px] font-extrabold text-lg hover:bg-[#ffcc33] transition-colors shadow-lg shadow-[#FFB800]/20 active:scale-95"
                >
                    {saved ? <><Check className="w-6 h-6" /> Platform Updated</> : <><Save className="w-6 h-6" /> Publish All Changes</>}
                </button>
            </div>
        </div>
    );
}
