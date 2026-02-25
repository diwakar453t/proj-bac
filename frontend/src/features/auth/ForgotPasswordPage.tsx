import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Brain, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/schemas';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function ForgotPasswordPage() {
    const [sent, setSent] = useState(false);
    const [serverError, setServerError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormValues) => {
        try {
            setServerError('');
            await authApi.forgotPassword(data.email);
            setSent(true);
        } catch (err) {
            setServerError(err instanceof Error ? err.message : 'Request failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-light dark:bg-bg-dark p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px]"
            >
                <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-8 card-shadow">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-3">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold">Reset Password</h1>
                        <p className="text-text-secondary dark:text-text-dark-secondary mt-1 text-center">
                            {sent ? 'Check your email for reset instructions' : 'Enter your email to receive a reset link'}
                        </p>
                    </div>

                    {!sent ? (
                        <>
                            {serverError && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-error">
                                    {serverError}
                                </div>
                            )}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="you@example.com"
                                    error={errors.email?.message}
                                    {...register('email')}
                                />
                                <Button type="submit" fullWidth isLoading={isSubmitting}>
                                    Send Reset Link
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-sm text-text-secondary dark:text-text-dark-secondary">
                                If an account exists, you'll receive an email shortly.
                            </p>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary-light"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
