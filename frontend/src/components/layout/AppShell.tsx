import { Outlet } from 'react-router-dom';
import { Sidebar, Navbar, BottomNav } from './Navigation';

export function AppShell() {
    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
            <Sidebar />
            <div className="lg:ml-[260px]">
                <Navbar />
                <main className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
                    <Outlet />
                </main>
            </div>
            <BottomNav />
        </div>
    );
}
