import { useStore } from '@/lib/store';
import { Trash2, Mail, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MessagesDashboard() {
    const messages = useStore((s) => s.messages);
    const deleteMessage = useStore((s) => s.deleteMessage);

    return (
        <div className="space-y-8 font-sans">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-4xl font-bold text-[#18112E] tracking-tight">Intercepted Intel</h1>
                    <p className="text-neutral-500 mt-2 font-medium">Direct communications from platform users.</p>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-[32px] border border-neutral-100 border-dashed text-neutral-400 font-bold">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50 text-[#18112E]" />
                    No incoming data streams.
                </div>
            ) : (
                <div className="grid gap-6">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white border border-neutral-100 rounded-[24px] p-6 lg:p-8 hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden group flex flex-col md:flex-row gap-8"
                        >
                            <div className="flex-1 min-w-0 flex flex-col md:flex-row gap-6">
                                {/* Sender Avatar */}
                                <div className="w-14 h-14 bg-[#F8F9FA] border border-neutral-100 rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <User className="w-6 h-6 text-[#FFB800]" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap mb-3">
                                        <span className="text-[#18112E] font-extrabold text-xl">{msg.name}</span>
                                        <div className="bg-[#F8F9FA] text-[#18112E] px-3 py-1 rounded-[8px] text-xs font-bold border border-neutral-100 shadow-sm">
                                            {msg.email}
                                        </div>
                                    </div>

                                    <div className="bg-[#F8F9FA] p-5 rounded-[16px] text-[#18112E] text-base font-medium leading-relaxed border border-neutral-100 mt-4 relative z-10">
                                        {msg.message}
                                    </div>

                                    {msg.createdAt && (
                                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs mt-4 font-bold">
                                            <Calendar className="w-4 h-4" />
                                            Received: {new Date(msg.createdAt).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Delete Action */}
                            <div className="flex md:items-center justify-end md:justify-center md:px-4">
                                <button
                                    onClick={() => deleteMessage(msg.id)}
                                    className="text-neutral-400 hover:text-red-500 hover:bg-red-50 p-3 rounded-[16px] transition-colors md:opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
