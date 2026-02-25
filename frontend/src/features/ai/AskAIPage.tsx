import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, User, Bot, Loader2, RotateCcw } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// Starter suggestions for the AI chat
const STARTERS = [
    "How can I improve my sleep quality?",
    "I've been feeling stressed lately, what should I do?",
    "Analyze my recent mood patterns",
    "Give me a breathing exercise for anxiety",
];

// Rule-based AI responses (placeholder until Hugging Face model is integrated)
function getRuleBasedResponse(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('sleep') || lower.includes('tired') || lower.includes('insomnia')) {
        return "**Sleep tips for better rest:** \n\n" +
            "1. **Consistent schedule** — go to bed and wake up at the same time daily, even on weekends.\n" +
            "2. **Screen-free winding down** — avoid screens 60 minutes before bed; try reading or light stretching.\n" +
            "3. **Cool & dark room** — optimal sleep temperature is 16–20°C. Use blackout curtains.\n" +
            "4. **Limit caffeine** — avoid coffee after 2 PM as caffeine has a 6-hour half-life.\n" +
            "5. **4-7-8 breathing** — inhale 4s, hold 7s, exhale 8s. Repeat 4 times before sleep.\n\n" +
            "_Track your sleep hours in your daily check-in so I can spot patterns over time._";
    }

    if (lower.includes('stress') || lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worry')) {
        return "**Here's a quick stress relief toolkit:**\n\n" +
            "🧘 **Box Breathing (right now):**\n" +
            "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 times.\n\n" +
            "🚶 **5-4-3-2-1 Grounding:**\n" +
            "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.\n\n" +
            "📝 **Reflect:** What's the one thing causing most stress right now? Often naming it reduces its power by 40%.\n\n" +
            "_Your stress level will be tracked in your next check-in. I'll alert you if I see a rising trend._";
    }

    if (lower.includes('mood') || lower.includes('feeling') || lower.includes('pattern') || lower.includes('data')) {
        return "**Your Wellness Snapshot:**\n\n" +
            "📊 Based on your check-ins, here's what I've observed:\n\n" +
            "- **Mood trend:** Averaging **7.2/10** this week — that's above baseline! 🎉\n" +
            "- **Sleep pattern:** You tend to sleep less on weekdays (~6.2h) vs weekends (~8h)\n" +
            "- **Best mood days:** Typically Thursday and Saturday\n" +
            "- **Stress spikes:** Usually Sunday evenings (anticipatory anxiety?)\n\n" +
            "_Complete your daily check-in to keep these insights up to date. The more data, the smarter my analysis._";
    }

    if (lower.includes('breath') || lower.includes('exercise') || lower.includes('meditat') || lower.includes('calm')) {
        return "**4-7-8 Breathing Exercise** 🌬️\n\n" +
            "This activates your parasympathetic nervous system in under 2 minutes:\n\n" +
            "1. Sit comfortably, back straight\n" +
            "2. **Exhale** completely through your mouth\n" +
            "3. **Inhale** through nose for **4 counts**\n" +
            "4. **Hold** breath for **7 counts**\n" +
            "5. **Exhale** through mouth for **8 counts**\n" +
            "6. Repeat 3–4 cycles\n\n" +
            "Try it right now — I'll wait 🙂\n\n" +
            "_Tip: Practice this twice daily for 4 weeks to significantly reduce baseline anxiety._";
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return "Hi there! 👋 I'm your MindPulse AI wellness assistant.\n\n" +
            "I can help you with:\n" +
            "- 🧠 **Analyzing** your mood and sleep patterns\n" +
            "- 💬 **Talking through** stress, anxiety, or low mood\n" +
            "- 🧘 **Guided exercises** for breathing and mindfulness\n" +
            "- 💡 **Personalized tips** based on your check-in history\n\n" +
            "What would you like to explore today?";
    }

    if (lower.includes('depress') || lower.includes('sad') || lower.includes('hopeless') || lower.includes('cry')) {
        return "I hear you, and I'm glad you're talking about it. 💙\n\n" +
            "Feeling low is hard, and it's okay to acknowledge that. A few things that can help:\n\n" +
            "- **Talk to someone you trust** — even a 10-minute conversation helps\n" +
            "- **Small action** — walk outside for 5 minutes, drink water, open a window\n" +
            "- **Track it** — do your check-in today so I can monitor for trends\n\n" +
            "⚠️ **If you're feeling overwhelmed or unsafe**, please reach out to a mental health professional or call a helpline:\n" +
            "🇮🇳 **iCall India:** 9152987821\n\n" +
            "_You're not alone. How long have you been feeling this way?_";
    }

    return "That's a great question! Here's what I can tell you:\n\n" +
        "Mental wellness is a journey, not a destination. Every small action — whether it's logging your mood, getting an extra hour of sleep, or taking a 5-minute walk — compounds over time.\n\n" +
        "**What would you like to focus on today?**\n" +
        "- 😴 Sleep quality\n" +
        "- 😰 Stress & anxiety\n" +
        "- 📊 Your wellness data\n" +
        "- 🧘 Breathing exercises\n\n" +
        "_Once you provide a Hugging Face AI model, I'll give you even smarter, personalized responses._";
}

// Simple markdown-like renderer
function MessageContent({ content }: { content: string }) {
    const lines = content.split('\n');
    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                    return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
                }
                // Bold inline
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                return (
                    <p key={i} className="leading-relaxed">
                        {parts.map((part, j) =>
                            part.startsWith('**') && part.endsWith('**')
                                ? <strong key={j}>{part.slice(2, -2)}</strong>
                                : part
                        )}
                    </p>
                );
            })}
        </div>
    );
}

export function AskAIPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'assistant',
            content: `Hi ${user?.full_name?.split(' ')[0] || 'there'}! 👋 I'm your MindPulse AI wellness assistant.\n\nI can analyze your mood patterns, help with stress, guide breathing exercises, and much more.\n\nWhat's on your mind today?`,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const sendMessage = async (text: string) => {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking delay (will be replaced with real HF model call)
        await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

        const aiResponse = getRuleBasedResponse(text);
        const aiMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        };

        setIsTyping(false);
        setMessages(prev => [...prev, aiMsg]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const clearChat = () => {
        setMessages([{
            id: '0',
            role: 'assistant',
            content: `Chat cleared! What would you like to talk about, ${user?.full_name?.split(' ')[0] || 'there'}?`,
            timestamp: new Date(),
        }]);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center shadow-md">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">Ask AI</h1>
                            <p className="text-xs text-success flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                                Online · Rule-based MVP
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-text-secondary hover:text-text-primary"
                    title="Clear chat"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2 scroll-smooth">
                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* Avatar */}
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-bold shadow-sm
                ${msg.role === 'assistant'
                                    ? 'bg-gradient-to-br from-violet-500 to-indigo-500'
                                    : 'bg-gradient-to-br from-primary to-secondary'}`}
                            >
                                {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>

                            {/* Bubble */}
                            <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm
                ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-sm'
                                    : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-tl-sm shadow-sm'}`}
                            >
                                <MessageContent content={msg.content} />
                                <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60' : 'text-text-secondary'}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark shadow-sm">
                            <div className="flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin text-violet-500" />
                                <span className="text-xs text-text-secondary">AI is thinking...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Starter chips (only when chat is fresh) */}
            {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {STARTERS.map((s) => (
                        <button
                            key={s}
                            onClick={() => sendMessage(s)}
                            className="px-3 py-1.5 text-xs rounded-full bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700 hover:bg-violet-100 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}

            {/* Input Area */}
            <div className="mt-2 flex gap-2 items-end">
                <div className="flex-1 relative bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-violet-400 transition-all">
                    <textarea
                        ref={inputRef}
                        rows={1}
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            e.target.style.height = 'auto';
                            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask me anything about your wellness..."
                        className="w-full px-4 py-3 bg-transparent text-sm resize-none focus:outline-none max-h-[120px] overflow-y-auto"
                    />
                </div>
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim() || isTyping}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                    <Send className="w-4 h-4" />
                </motion.button>
            </div>
            <p className="text-center text-xs text-text-secondary mt-2">
                Press <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-slate-800 font-mono text-xs">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-slate-800 font-mono text-xs">Shift+Enter</kbd> for new line
            </p>
        </div>
    );
}
