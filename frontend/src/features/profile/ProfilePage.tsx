import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Bell, Palette, Trash2, Save, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';

export function ProfilePage() {
    const { user } = useAuth();
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
        >
            <h1 className="text-2xl lg:text-3xl font-bold">Profile & Settings</h1>

            {/* Profile Header */}
            <Card padding="lg">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Avatar name={user?.full_name || 'User'} size="lg" />
                    <div className="text-center sm:text-left flex-1">
                        <h2 className="text-xl font-bold">{user?.full_name}</h2>
                        <p className="text-text-secondary dark:text-text-dark-secondary">{user?.email}</p>
                        <Badge variant="info" size="md">{user?.role || 'user'}</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                        Change Avatar
                    </Button>
                </div>
            </Card>

            {/* Personal Info */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" defaultValue={user?.full_name} placeholder="Your name" />
                    <Input label="Email" defaultValue={user?.email} type="email" placeholder="Email" />
                </div>
                <div className="mt-4 flex justify-end">
                    <Button size="sm">
                        <Save className="w-4 h-4" /> Save Changes
                    </Button>
                </div>
            </Card>

            {/* Preferences */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-accent" />
                    <h3 className="font-semibold">Preferences</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                        <div className="flex items-center gap-3">
                            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                            <div>
                                <p className="text-sm font-medium">Dark Mode</p>
                                <p className="text-xs text-text-secondary">Switch between light and dark themes</p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary' : 'bg-gray-300'}`}
                        >
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                </div>
            </Card>

            {/* Security */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-secondary" />
                    <h3 className="font-semibold">Security</h3>
                </div>
                <div className="space-y-4">
                    <Input label="Current Password" type="password" placeholder="••••••••" />
                    <Input label="New Password" type="password" placeholder="••••••••" />
                    <Input label="Confirm Password" type="password" placeholder="••••••••" />
                    <Button size="sm">Update Password</Button>
                </div>
            </Card>

            {/* Notifications */}
            <Card padding="lg">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-5 h-5 text-warning" />
                    <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="space-y-3">
                    {['Email notifications', 'Push notifications', 'Weekly digest'].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800">
                            <span className="text-sm">{item}</span>
                            <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-primary" />
                        </div>
                    ))}
                </div>
            </Card>

            {/* Danger Zone */}
            <Card padding="lg" className="border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-4">
                    <Trash2 className="w-5 h-5 text-error" />
                    <h3 className="font-semibold text-error">Danger Zone</h3>
                </div>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary mb-4">
                    Permanently delete your account and all associated data.
                </p>
                <Button variant="danger" size="sm">Delete Account</Button>
            </Card>
        </motion.div>
    );
}
