import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Brain, Shield, LineChart, Zap, HeartPulse, Bell,
    CheckCircle, ArrowRight, Star, Users, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { NeuralBrainCanvas } from '@/components/three/NeuralBrainCanvas';

const features = [
    {
        icon: HeartPulse,
        title: 'Daily Wellness Check-ins',
        description: 'Track your mood, sleep, and mental health with quick daily entries.',
        color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
    },
    {
        icon: Brain,
        title: 'AI-Powered Insights',
        description: 'Our internal AI analyzes your patterns and provides personalized recommendations.',
        color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600',
    },
    {
        icon: LineChart,
        title: 'Visual Dashboards',
        description: 'Beautiful charts showing mood trends, sleep patterns, and stress levels.',
        color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    },
    {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'Get notified when patterns suggest attention is needed for your wellbeing.',
        color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    },
    {
        icon: Shield,
        title: 'Privacy First',
        description: 'Your data stays encrypted and private. We never share with third parties.',
        color: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    },
    {
        icon: Zap,
        title: 'Blazing Fast',
        description: 'Optimized for mobile-first experience. Works great on low bandwidth too.',
        color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    },
];

const testimonials = [
    {
        name: 'Aarav S.',
        role: 'Student',
        content: "Mind Matrix helped me understand my sleep patterns and improve my exam performance.",
        rating: 5,
    },
    {
        name: 'Priya M.',
        role: 'Coach',
        content: "The dashboard gives me incredible visibility into my students' wellbeing trends.",
        rating: 5,
    },
    {
        name: 'Rahul K.',
        role: 'Professional',
        content: "The AI insights are surprisingly accurate. It caught my burnout early.",
        rating: 5,
    },
];

export function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-border-light dark:border-border-dark">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
                            <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl text-gradient">Mind Matrix</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/ask-ai">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                    bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md
                    hover:shadow-violet-300 hover:shadow-lg transition-shadow duration-300"
                            >
                                <Sparkles className="w-4 h-4" />
                                Ask AI
                            </motion.button>
                        </Link>
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 lg:py-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left — copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                                <Zap className="w-4 h-4" />
                                AI-powered mental wellness platform
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                                Your mental health,{' '}
                                <span className="text-gradient">powered by AI</span>
                            </h1>
                            <p className="text-lg lg:text-xl text-text-secondary dark:text-text-dark-secondary mb-8 max-w-xl">
                                Track your daily wellness, get AI-driven insights, and take control of your mental health with personalized recommendations.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Link to="/signup">
                                    <Button size="lg">
                                        Start Free <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="outline" size="lg">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex items-center gap-6 mt-8 text-sm text-text-secondary">
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    Free to start
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    No credit card
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4 text-success" />
                                    Privacy first
                                </div>
                            </div>
                        </motion.div>

                        {/* Right — Three.js Neural Brain */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative hidden lg:block"
                        >
                            <div className="w-full h-[480px] rounded-3xl overflow-hidden bg-gradient-to-br from-violet-950/60 to-indigo-950/60 border border-violet-500/20 shadow-2xl shadow-violet-500/10">
                                <NeuralBrainCanvas />
                            </div>
                            {/* Floating badges */}
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-black/10 px-4 py-3 flex items-center gap-2 border border-border-light dark:border-border-dark"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <HeartPulse className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">Mood Today</p>
                                    <p className="text-sm font-bold text-success">8.4 / 10</p>
                                </div>
                            </motion.div>
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                                className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-black/10 px-4 py-3 flex items-center gap-2 border border-border-light dark:border-border-dark"
                            >
                                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-violet-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-text-secondary">AI Insights Active</p>
                                    <p className="text-sm font-bold text-violet-600">Real-time</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                            Everything you need for <span className="text-gradient">mental wellness</span>
                        </h2>
                        <p className="text-text-secondary dark:text-text-dark-secondary max-w-2xl mx-auto">
                            A comprehensive platform designed to help you understand and improve your mental health.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature) => (
                            <motion.div key={feature.title} variants={itemVariants}>
                                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6 h-full hover:shadow-lg transition-shadow duration-300">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-text-secondary dark:text-text-dark-secondary leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-20 lg:py-28 bg-gray-50 dark:bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">How it works</h2>
                        <p className="text-text-secondary dark:text-text-dark-secondary">Three simple steps to better mental health</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Daily Check-in', desc: 'Share how you feel — mood, sleep, and notes in under 30 seconds.' },
                            { step: '02', title: 'AI Analysis', desc: 'Our AI processes your data to find patterns and generate insights.' },
                            { step: '03', title: 'Get Insights', desc: 'View personalized recommendations and track your wellness over time.' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">{item.step}</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                <p className="text-text-secondary dark:text-text-dark-secondary">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Loved by users</h2>
                        <p className="text-text-secondary dark:text-text-dark-secondary">See what our community has to say</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                                className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-6"
                            >
                                <div className="flex gap-1 mb-3">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm leading-relaxed mb-4">{t.content}</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full gradient-secondary flex items-center justify-center text-white text-xs font-bold">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{t.name}</p>
                                        <p className="text-xs text-text-secondary">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA — white text on gradient, black button */}
            <section className="py-20 lg:py-28">
                <div className="max-w-4xl mx-auto px-4 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="gradient-primary rounded-3xl p-12"
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
                            Ready to start your wellness journey?
                        </h2>
                        <p className="text-white/80 mb-8 max-w-xl mx-auto">
                            Join thousands of users who are taking control of their mental health with Mind Matrix.
                        </p>
                        <Link to="/signup">
                            <Button
                                size="lg"
                                className="bg-white text-black font-bold hover:bg-gray-100 focus:ring-white"
                            >
                                Get Started Free <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border-light dark:border-border-dark py-12">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-gradient">Mind Matrix</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <Users className="w-4 h-4" />
                            Built with ❤️ by Diwakar Patel
                        </div>
                        <p className="text-sm text-text-secondary">
                            © {new Date().getFullYear()} Mind Matrix. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
