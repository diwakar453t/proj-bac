import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smile, Moon, Flame, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { MoodLineChart } from '@/components/charts/MoodLineChart';
import { SleepBarChart } from '@/components/charts/SleepBarChart';
import { StressPieChart } from '@/components/charts/StressPieChart';
import { useAuth } from '@/features/auth/AuthContext';

// Demo data for now - will be replaced with real API calls
const demoMoodData = [
    { date: 'Mon', mood: 7 }, { date: 'Tue', mood: 6 }, { date: 'Wed', mood: 8 },
    { date: 'Thu', mood: 5 }, { date: 'Fri', mood: 7 }, { date: 'Sat', mood: 9 }, { date: 'Sun', mood: 8 },
];
const demoSleepData = [
    { date: 'Mon', hours: 7 }, { date: 'Tue', hours: 6 }, { date: 'Wed', hours: 8 },
    { date: 'Thu', hours: 5 }, { date: 'Fri', hours: 7 }, { date: 'Sat', hours: 9 }, { date: 'Sun', hours: 7 },
];
const demoStressData = [
    { name: 'Low', value: 35 }, { name: 'Medium', value: 40 },
    { name: 'High', value: 18 }, { name: 'Critical', value: 7 },
];

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    trend?: { value: number; positive: boolean };
    color: string;
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
    return (
        <Card hover padding="md">
            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    {icon}
                </div>
                {trend && (
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${trend.positive ? 'text-success' : 'text-error'}`}>
                        {trend.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {trend.value}%
                    </span>
                )}
            </div>
            <div className="mt-3">
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm text-text-secondary dark:text-text-dark-secondary">{label}</p>
            </div>
        </Card>
    );
}

export function DashboardPage() {
    const { user } = useAuth();
    const [range, setRange] = useState('7d');
    const [isLoading] = useState(false);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* Header */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">
                        {greeting()}, {user?.full_name?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
                        Here's your wellness overview
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-xl p-1">
                    {['7d', '30d', '90d'].map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${range === r
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'text-text-secondary hover:text-text-primary'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={<Smile className="w-5 h-5 text-white" />}
                    label="Avg. Mood"
                    value="7.2"
                    trend={{ value: 12, positive: true }}
                    color="bg-primary"
                />
                <StatCard
                    icon={<Moon className="w-5 h-5 text-white" />}
                    label="Avg. Sleep"
                    value="7.1h"
                    trend={{ value: 5, positive: true }}
                    color="bg-secondary"
                />
                <StatCard
                    icon={<Flame className="w-5 h-5 text-white" />}
                    label="Check-in Streak"
                    value="12 days"
                    color="bg-accent"
                />
                <StatCard
                    icon={<AlertTriangle className="w-5 h-5 text-white" />}
                    label="Open Alerts"
                    value="2"
                    color="bg-warning"
                />
            </motion.div>

            {/* Charts */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MoodLineChart data={demoMoodData} />
                <SleepBarChart data={demoSleepData} />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StressPieChart data={demoStressData} />
                <Card padding="lg" className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {demoMoodData.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                <div className={`w-2 h-2 rounded-full ${item.mood >= 7 ? 'bg-success' : item.mood >= 5 ? 'bg-warning' : 'bg-error'}`} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{item.date} - Mood: {item.mood}/10</p>
                                    <p className="text-xs text-text-secondary dark:text-text-dark-secondary">Daily check-in completed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    );
}
