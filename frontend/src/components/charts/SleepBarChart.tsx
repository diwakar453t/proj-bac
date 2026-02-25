import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface SleepBarChartProps {
    data: Array<{ date: string; hours: number }>;
}

export function SleepBarChart({ data }: SleepBarChartProps) {
    return (
        <Card padding="lg" className="w-full">
            <h3 className="text-lg font-semibold mb-4">Sleep Hours</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                        />
                        <YAxis
                            domain={[0, 12]}
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="hours"
                            fill="url(#sleepGradient)"
                            radius={[8, 8, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
