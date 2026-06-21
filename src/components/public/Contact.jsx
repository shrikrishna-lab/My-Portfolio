import { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { useStore } from '@/lib/store';
import { Send, Mail, MapPin } from 'lucide-react';

export default function Contact() {
    const profile = useStore((state) => state.profile);
    const addMessage = useStore((state) => state.addMessage);
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    if (!profile) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
            setError('All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email.trim())) {
            setError('Please enter a valid email address.');
            return;
        }

        setSending(true);

        // Store message locally
        await addMessage({
            name: form.name.trim(),
            email: form.email.trim(),
            message: form.message.trim()
        });

        // Dispatch email via Web3Forms if key exists
        if (profile.web3formsKey) {
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        access_key: profile.web3formsKey,
                        name: form.name.trim(),
                        email: form.email.trim(),
                        message: form.message.trim(),
                        subject: `New Portfolio Contact Message from ${form.name.trim()}`
                    })
                });
                const resData = await response.json();
                if (!response.ok || !resData.success) {
                    throw new Error(resData.message || 'Web3Forms API error');
                }
            } catch (err) {
                console.error('Email dispatch error:', err);
                // Note: We don't block user experience since the message is saved locally
            }
        }

        setSending(false);
        setSent(true);
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <section id="contact" className="lazy-section py-32 px-4 relative overflow-hidden bg-[#FFB800] border-t-2 border-[#18112E]">
            <div className="absolute bottom-0 left-0 w-full h-[500px] pointer-events-none bg-gradient-to-t from-white/20 to-transparent blur-[100px] -z-10" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    className="flex flex-col items-center justify-center text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-10 h-1 bg-[#18112E]" />
                        <span className="text-[#18112E] font-extrabold tracking-wider text-sm uppercase">Let's Connect</span>
                        <span className="w-10 h-1 bg-[#18112E]" />
                    </div>

                    <h2 className="text-4xl sm:text-5xl md:text-8xl font-black text-[#18112E] tracking-tighter uppercase leading-[0.9]">
                        Start a <br />
                        <span className="text-white drop-shadow-[4px_4px_0_rgba(24,17,46,1)]">Conversation.</span>
                    </h2>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 relative">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="space-y-12 bg-white rounded-[32px] p-6 sm:p-10 border-2 border-[#18112E] shadow-[8px_8px_0_#18112E]"
                    >
                        <p className="text-neutral-600 text-lg sm:text-xl leading-relaxed font-bold">
                            Whether you have a question, a project idea, or just want to say hi, my inbox is always open.
                            <span className="block text-[#18112E] mt-4 font-black text-xl sm:text-2xl">Let's build something exceptional together.</span>
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 sm:gap-6 group cursor-default min-w-0">
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#F8F9FA] border-2 border-[#18112E] flex items-center justify-center shadow-[4px_4px_0_#18112E] group-hover:bg-[#FFB800] transition-colors group-hover:-translate-y-1">
                                    <Mail className="w-6 h-6 text-[#18112E]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm text-neutral-500 font-bold mb-1 uppercase tracking-wider">Email</div>
                                    <div className="text-lg sm:text-xl font-black text-[#18112E] tracking-tight break-all">{profile.email}</div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 sm:gap-6 group cursor-default min-w-0">
                                <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#F8F9FA] border-2 border-[#18112E] flex items-center justify-center shadow-[4px_4px_0_#18112E] group-hover:bg-[#FFB800] transition-colors group-hover:-translate-y-1">
                                    <MapPin className="w-6 h-6 text-[#18112E]" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="text-sm text-neutral-500 font-bold mb-1 uppercase tracking-wider">Location</div>
                                    <div className="text-lg sm:text-xl font-black text-[#18112E] tracking-tight break-words">Based in India, working globally</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6 bg-white rounded-[32px] p-6 sm:p-10 border-2 border-[#18112E] shadow-[8px_8px_0_#18112E]"
                    >
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-black text-[#18112E] uppercase tracking-wider">Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full bg-[#F8F9FA] border-2 border-[#18112E] rounded-[16px] px-6 py-4 text-[#18112E] placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#18112E] transition-all font-bold"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-black text-[#18112E] uppercase tracking-wider">Email</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-[#F8F9FA] border-2 border-[#18112E] rounded-[16px] px-6 py-4 text-[#18112E] placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#18112E] transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 flex-1 flex flex-col">
                            <label className="text-sm font-black text-[#18112E] uppercase tracking-wider">Message</label>
                            <textarea
                                placeholder="Tell me about your project..."
                                value={form.message}
                                onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="w-full flex-1 min-h-[160px] bg-[#F8F9FA] border-2 border-[#18112E] rounded-[16px] px-6 py-4 text-[#18112E] placeholder-neutral-400 focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_#18112E] transition-all resize-none font-bold"
                            />
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={sending}
                            className="w-full flex items-center justify-center gap-3 bg-[#18112E] text-white font-black uppercase tracking-wide py-5 rounded-[16px] hover:bg-black transition-colors disabled:opacity-50 mt-4 shadow-[4px_4px_0_#18112E] border-2 border-[#18112E] hover:text-[#FFB800]"
                        >
                            {sent ? (
                                'Message Sent'
                            ) : sending ? (
                                'Sending...'
                            ) : (
                                <>
                                    Send Message <Send className="w-5 h-5" />
                                </>
                            )}
                        </motion.button>
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border-2 border-red-500 text-red-600 rounded-[16px] text-sm font-bold text-center">
                                ⚠️ {error}
                            </div>
                        )}
                        {sent && (
                            <div className="mt-4 p-4 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-[16px] text-sm font-bold text-center">
                                🎉 Thank you! Your message has been sent successfully.
                            </div>
                        )}
                    </motion.form>
                </div>
            </div>
        </section>
    );
}
