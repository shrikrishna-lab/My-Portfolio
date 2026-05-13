import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const login = useStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.error || 'Access denied. Check credentials.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex font-sans selection:bg-[#FFB800]/30 selection:text-black">

            {/* Right Side - Minimalist Form */}
            <div className="flex-1 flex flex-col justify-center px-8 lg:px-24 bg-white relative">
                <div className="w-full max-w-[420px] mx-auto">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <div className="w-16 h-16 bg-[#F8F9FA] rounded-[24px] flex items-center justify-center mb-8 shadow-inner border border-neutral-100">
                            <Shield className="w-8 h-8 text-[#18112E]" />
                        </div>
                        <h1 className="text-[40px] leading-tight font-bold text-[#18112E] mb-3">Sign in</h1>
                        <p className="text-neutral-500 font-medium text-lg">Enter your credentials to continue.</p>
                    </motion.div>

                    {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-4 bg-red-50 text-red-600 rounded-[16px] text-sm font-semibold border border-red-100 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-[#18112E]">Email Address</label>
                            <input
                                type="email"
                                placeholder="secret@admin.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#F8F9FA] border-2 border-transparent px-5 py-4 rounded-[16px] text-[#18112E] focus:outline-none focus:bg-white focus:border-[#FFB800] transition-all font-medium shadow-sm"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-[#18112E]">Password</label>
                                <a href="#" className="text-xs font-bold text-[#FFB800] hover:text-[#e6a600] transition-colors">Forgot?</a>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#F8F9FA] border-2 border-transparent px-5 py-4 rounded-[16px] text-[#18112E] focus:outline-none focus:bg-white focus:border-[#FFB800] transition-all font-medium shadow-sm"
                                required
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-[#FFB800] text-[#18112E] font-bold text-lg py-4 rounded-[16px] flex items-center justify-center gap-3 hover:bg-[#ffcc33] transition-all mt-10 shadow-[0_10px_30px_rgba(255,184,0,0.3)] group"
                        >
                            <span>Authenticate</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>

                        <p className="text-center text-sm font-semibold text-neutral-400 mt-8">

                        </p>
                    </form>
                </div>
            </div>

        </div>
    );
}
