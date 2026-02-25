import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    ClipboardCheck,
    LineChart,
    User,
    Settings,
    Shield,
    LogOut,
    Menu,
    X,
    Brain,
    Bell,
    Sparkles,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', special: false },
    { to: '/ask-ai', icon: Sparkles, label: 'Ask AI', special: true },
    { to: '/checkin', icon: ClipboardCheck, label: 'Check-in', special: false },
    { to: '/insights', icon: LineChart, label: 'Insights', special: false },
    { to: '/profile', icon: User, label: 'Profile', special: false },
    { to: '/settings', icon: Settings, label: 'Settings', special: false },
];

const adminItems = [
    { to: '/admin', icon: Shield, label: 'Admin Panel', special: false },
];

export function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const allItems = user?.role === 'admin' ? [...navItems, ...adminItems] : navItems;

    return (
        <motion.aside
            animate={{ width: collapsed ? 72 : 260 }}
            className="hidden lg:flex flex-col h-screen bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark fixed left-0 top-0 z-40"
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-16 border-b border-border-light dark:border-border-dark">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-bold text-lg text-gradient"
                        >
                            MindPulse
                        </motion.span>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="ml-auto p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                    {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-4 h-4" />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {allItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
              ${item.special
                                ? isActive
                                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                                    : 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                                : isActive
                                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                    : 'text-text-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-slate-800'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            <div className="p-3 border-t border-border-light dark:border-border-dark">
                <div className="flex items-center gap-3 px-2 py-2">
                    <Avatar name={user?.full_name || 'User'} size="sm" />
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0"
                            >
                                <p className="text-sm font-medium truncate">{user?.full_name}</p>
                                <p className="text-xs text-text-secondary dark:text-text-dark-secondary truncate">{user?.email}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-error hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-1"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && 'Logout'}
                </button>
            </div>
        </motion.aside>
    );
}

export function Navbar() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-30 h-16 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between h-full px-4 lg:px-8">
                {/* Mobile logo */}
                <div className="flex items-center gap-2 lg:hidden">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gradient">MindPulse</span>
                </div>

                {/* Search bar placeholder */}
                <div className="hidden lg:block" />

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                        <Bell className="w-5 h-5 text-text-secondary" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
                    </button>
                    <div className="hidden sm:flex items-center gap-2">
                        <Avatar name={user?.full_name || 'User'} size="sm" />
                        <span className="text-sm font-medium">{user?.full_name}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export function BottomNav() {
    const mobileItems = navItems.slice(0, 5);

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-lg border-t border-border-light dark:border-border-dark safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {mobileItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors
              ${isActive
                                ? 'text-primary'
                                : 'text-text-secondary dark:text-text-dark-secondary'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
