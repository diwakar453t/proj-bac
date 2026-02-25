import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, MoreVertical, UserCheck, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';

// Demo data
const demoUsers = [
    { id: '1', full_name: 'Aarav Sharma', email: 'aarav@example.com', role: 'user', created_at: '2026-02-01', last_login: '2026-02-25' },
    { id: '2', full_name: 'Priya Patel', email: 'priya@example.com', role: 'coach', created_at: '2026-01-15', last_login: '2026-02-24' },
    { id: '3', full_name: 'Rahul Kumar', email: 'rahul@example.com', role: 'user', created_at: '2026-02-10', last_login: '2026-02-23' },
    { id: '4', full_name: 'Neha Singh', email: 'neha@example.com', role: 'admin', created_at: '2026-01-01', last_login: '2026-02-25' },
    { id: '5', full_name: 'Vikram Reddy', email: 'vikram@example.com', role: 'user', created_at: '2026-02-20', last_login: null },
];

const roleBadge = (role: string) => {
    const variants: Record<string, 'info' | 'success' | 'warning'> = {
        user: 'info', coach: 'success', admin: 'warning',
    };
    return <Badge variant={variants[role] || 'info'}>{role}</Badge>;
};

export function AdminPage() {
    const [search, setSearch] = useState('');
    const [isLoading] = useState(false);

    const filtered = demoUsers.filter(
        (u) => u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-primary" />
                        <h1 className="text-2xl lg:text-3xl font-bold">Admin Panel</h1>
                    </div>
                    <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
                        Manage users and system settings
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge variant="info" size="md">{demoUsers.length} users</Badge>
                </div>
            </div>

            {/* Search & Filters */}
            <Card padding="md">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm
                bg-surface-light dark:bg-surface-dark
                border-border-light dark:border-border-dark
                focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <select className="px-4 py-2.5 rounded-xl border text-sm bg-surface-light dark:bg-surface-dark border-border-light dark:border-border-dark">
                        <option value="">All Roles</option>
                        <option value="user">User</option>
                        <option value="coach">Coach</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </Card>

            {/* Users Table */}
            <Card padding="sm">
                {isLoading ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border-light dark:border-border-dark">
                                    <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-3">User</th>
                                    <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-3">Role</th>
                                    <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Joined</th>
                                    <th className="text-left text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-3 hidden md:table-cell">Last Login</th>
                                    <th className="text-right text-xs font-semibold text-text-secondary uppercase tracking-wider px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => (
                                    <tr key={user.id} className="border-b border-border-light dark:border-border-dark last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={user.full_name} size="sm" />
                                                <div>
                                                    <p className="text-sm font-medium">{user.full_name}</p>
                                                    <p className="text-xs text-text-secondary">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">{roleBadge(user.role)}</td>
                                        <td className="px-4 py-3 text-sm text-text-secondary hidden sm:table-cell">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-secondary hidden md:table-cell">
                                            {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" title="Activate">
                                                    <UserCheck className="w-4 h-4 text-success" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" title="Deactivate">
                                                    <UserX className="w-4 h-4 text-error" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border-light dark:border-border-dark">
                    <p className="text-sm text-text-secondary">Showing {filtered.length} of {demoUsers.length}</p>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4" /></Button>
                        <span className="text-sm font-medium px-2">1</span>
                        <Button variant="ghost" size="sm"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
