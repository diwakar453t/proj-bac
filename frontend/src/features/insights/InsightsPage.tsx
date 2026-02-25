import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const demoInsights = [
    {
        id: '1',
        date: '2026-02-25',
        summary: 'Your mood has been consistently above average this week. Sleep patterns are improving.',
        labels: { stress_level: 3, risk_score: 1, overall_wellness: 8 },
        confidence: 0.87,
    },
    {
        id: '2',
        date: '2026-02-24',
        summary: 'Slight dip in mood detected. Consider relaxation techniques before bedtime.',
        labels: { stress_level: 5, risk_score: 2, overall_wellness: 6 },
        confidence: 0.82,
    },
    {
        id: '3',
        date: '2026-02-23',
        summary: 'Great progress! Your 7-day average sleep is at 7.5 hours. Keep maintaining this routine.',
        labels: { stress_level: 2, risk_score: 1, overall_wellness: 9 },
        confidence: 0.91,
    },
];

function WellnessScore({ score }: { score: number }) {
    const color = score >= 7 ? 'text-success' : score >= 5 ? 'text-warning' : 'text-error';
    const bgColor = score >= 7 ? 'bg-green-100 dark:bg-green-900/30' : score >= 5 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30';

    return (
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
            <span className={`text-lg font-bold ${color}`}>{score}</span>
        </div>
    );
}

export function InsightsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-primary" />
                    <h1 className="text-2xl lg:text-3xl font-bold">AI Insights</h1>
                </div>
                <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
                    Analysis of your wellness patterns
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card hover padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">Good</p>
                            <p className="text-sm text-text-secondary">Overall Trend</p>
                        </div>
                    </div>
                </Card>
                <Card hover padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">+15%</p>
                            <p className="text-sm text-text-secondary">Wellness Improvement</p>
                        </div>
                    </div>
                </Card>
                <Card hover padding="md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">1</p>
                            <p className="text-sm text-text-secondary">Attention Needed</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Insight Cards */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Recent Analysis</h2>
                {demoInsights.map((insight) => (
                    <Card key={insight.id} hover padding="lg">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <WellnessScore score={insight.labels.overall_wellness} />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-sm text-text-secondary">{new Date(insight.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                                    <Badge variant={insight.labels.stress_level <= 3 ? 'success' : 'warning'}>
                                        Stress: {insight.labels.stress_level}/10
                                    </Badge>
                                    <Badge variant="info">
                                        {Math.round(insight.confidence * 100)}% confidence
                                    </Badge>
                                </div>
                                <p className="text-sm leading-relaxed">{insight.summary}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </motion.div>
    );
}
