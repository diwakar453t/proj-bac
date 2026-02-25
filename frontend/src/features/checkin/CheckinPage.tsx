import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Smile, Meh, Frown, Moon, FileText, Send, CheckCircle } from 'lucide-react';
import { checkinSchema, type CheckinFormValues } from '@/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

const moodEmojis = [
    { value: 1, icon: Frown, label: 'Very Bad', color: 'text-red-500' },
    { value: 2, icon: Frown, label: 'Bad', color: 'text-red-400' },
    { value: 3, icon: Frown, label: 'Poor', color: 'text-orange-500' },
    { value: 4, icon: Meh, label: 'Below Avg', color: 'text-orange-400' },
    { value: 5, icon: Meh, label: 'Average', color: 'text-yellow-500' },
    { value: 6, icon: Meh, label: 'OK', color: 'text-yellow-400' },
    { value: 7, icon: Smile, label: 'Good', color: 'text-green-400' },
    { value: 8, icon: Smile, label: 'Great', color: 'text-green-500' },
    { value: 9, icon: Smile, label: 'Amazing', color: 'text-emerald-500' },
    { value: 10, icon: Smile, label: 'Perfect', color: 'text-emerald-600' },
];

export function CheckinPage() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<CheckinFormValues>({
        resolver: zodResolver(checkinSchema),
        defaultValues: { mood: 5, sleep_hours: 7, notes: '' },
    });

    const currentMood = watch('mood');

    const onSubmit = async (_data: CheckinFormValues) => {
        // Will be replaced with real API call
        await new Promise((r) => setTimeout(r, 1000));
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Check-in Complete! 🎉</h2>
                <p className="text-text-secondary dark:text-text-dark-secondary mb-6 max-w-md">
                    Your wellness data has been recorded. AI analysis will be available shortly.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">
                    Submit Another
                </Button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-6"
        >
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">Daily Check-in</h1>
                <p className="text-text-secondary dark:text-text-dark-secondary mt-1">
                    How are you feeling today?
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Mood Selector */}
                <Card padding="lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Smile className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold">Mood</h3>
                        <span className="ml-auto text-2xl font-bold text-primary">{currentMood}/10</span>
                    </div>
                    <Controller
                        name="mood"
                        control={control}
                        render={({ field }) => (
                            <div>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={field.value}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between mt-3">
                                    {moodEmojis.map((emoji) => {
                                        const Icon = emoji.icon;
                                        return (
                                            <button
                                                key={emoji.value}
                                                type="button"
                                                onClick={() => field.onChange(emoji.value)}
                                                className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all
                          ${currentMood === emoji.value ? `${emoji.color} scale-125` : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="text-[10px] hidden sm:block">{emoji.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    />
                    {errors.mood && <p className="mt-2 text-sm text-error">{errors.mood.message}</p>}
                </Card>

                {/* Sleep Hours */}
                <Card padding="lg">
                    <div className="flex items-center gap-2 mb-4">
                        <Moon className="w-5 h-5 text-secondary" />
                        <h3 className="font-semibold">Sleep Hours</h3>
                    </div>
                    <Input
                        type="number"
                        step="0.5"
                        min="0"
                        max="24"
                        placeholder="7.5"
                        error={errors.sleep_hours?.message}
                        {...register('sleep_hours', { valueAsNumber: true })}
                    />
                </Card>

                {/* Notes */}
                <Card padding="lg">
                    <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-accent" />
                        <h3 className="font-semibold">Notes</h3>
                        <span className="text-xs text-text-secondary ml-auto">Optional</span>
                    </div>
                    <textarea
                        rows={4}
                        placeholder="How are you feeling? Any thoughts to share..."
                        className="w-full px-4 py-3 rounded-xl border text-sm
              bg-surface-light dark:bg-surface-dark
              text-text-primary dark:text-text-dark-primary
              border-border-light dark:border-border-dark
              placeholder:text-text-secondary
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200 resize-none"
                        {...register('notes')}
                    />
                    {errors.notes && <p className="mt-1 text-sm text-error">{errors.notes.message}</p>}
                </Card>

                <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                    <Send className="w-4 h-4" />
                    Submit Check-in
                </Button>
            </form>
        </motion.div>
    );
}
