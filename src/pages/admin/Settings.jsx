import { useStore } from '@/lib/store';
import { Info, Trash2, Power } from 'lucide-react';

export default function Settings() {
    const logout = useStore((s) => s.logout);

    const handleClearData = async () => {
        if (window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
            await logout();
            window.location.href = '/';
        }
    };

    return (
        <div className="space-y-8 font-sans max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
                <div>
                    <h1 className="text-4xl font-bold text-[#18112E] tracking-tight">System Settings</h1>
                    <p className="text-neutral-500 mt-2 font-medium">Manage platform parameters and secure access.</p>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="bg-white border border-neutral-100 rounded-[32px] p-8 space-y-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row gap-8 items-start">
                    <div className="w-16 h-16 rounded-[24px] bg-[#F8F9FA] border border-neutral-100 flex items-center justify-center flex-shrink-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
                        <Info className="w-8 h-8 text-[#FFB800]" />
                    </div>

                    <div className="flex-1 space-y-4">
                        <h2 className="text-2xl font-extrabold text-[#18112E] flex items-center gap-3">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            System Online
                        </h2>

                        <div className="bg-[#F8F9FA] rounded-[16px] p-4 border border-neutral-100 font-medium text-[#18112E]">
                            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Status</span>
                            Root access granted and secure link established. Operating with full administrative privileges.
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-red-100 rounded-[32px] p-8 space-y-6 shadow-sm relative overflow-hidden flex flex-col sm:flex-row gap-8 items-start group hover:border-red-200 transition-colors">
                    <div className="w-16 h-16 rounded-[24px] bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                        <Power className="w-8 h-8 text-red-500" />
                    </div>

                    <div className="flex-1 space-y-5">
                        <h2 className="text-2xl font-extrabold text-red-600 flex items-center gap-3">
                            Danger Zone
                        </h2>

                        <p className="text-neutral-500 font-medium leading-relaxed bg-[#F8F9FA] p-4 rounded-[16px] border border-neutral-100">
                            <strong className="text-[#18112E] block mb-1">Proceed with extreme caution.</strong>
                            Executing a reset protocol will purge all database records and restore factory defaults. Once triggered, this operation is fully irrevocable and will permanently destroy user modified content.
                        </p>

                        <div className="pt-2">
                            <button
                                onClick={handleClearData}
                                className="flex items-center gap-3 bg-red-50 text-red-600 border border-red-200 px-6 py-4 rounded-[16px] font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm active:scale-95"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span>Execute Factory Reset</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
