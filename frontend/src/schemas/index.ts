import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signupSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email'),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
});

export const checkinSchema = z.object({
    mood: z.number().min(1, 'Mood must be between 1-10').max(10),
    sleep_hours: z.number().min(0, 'Sleep hours cannot be negative').max(24, 'Max 24 hours'),
    notes: z.string().max(1000, 'Notes must be under 1000 characters'),
});

export const profileSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type CheckinFormValues = z.infer<typeof checkinSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;
