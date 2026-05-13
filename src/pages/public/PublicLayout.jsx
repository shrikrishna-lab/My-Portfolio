import { Outlet } from 'react-router-dom';
import BackgroundScene from '@/components/public/BackgroundScene';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] text-[#18112E] selection:bg-[#FFB800] selection:text-[#18112E] relative font-sans">
            <BackgroundScene />
            <div className="relative z-10 w-full overflow-hidden">
                <Outlet />
            </div>
        </div>
    );
}
