import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from '@/components/ui/Card';

interface MoodLineChartProps {
    data: Array<{ date: string; mood: number }>;
}

export function MoodLineChart({ data }: MoodLineChartProps) {
    return (
        <Card padding="lg" className="w-full">
            <h3 className="text-lg font-semibold mb-4">Mood Trend</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={{ stroke: '#E2E8F0' }}
                        />
                        <YAxis
                            domain={[0, 10]}
                            tick={{ fontSize: 12, fill: '#64748B' }}
                            tickLine={false}
                            axisLine={{ stroke: '#E2E8F0' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                padding: '12px',
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="mood"
                            stroke="#4F46E5"
                            strokeWidth={3}
                            dot={{ fill: '#4F46E5', r: 4 }}
                            activeDot={{ r: 6, fill: '#4F46E5' }}
                            fill="url(#moodGradient)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
