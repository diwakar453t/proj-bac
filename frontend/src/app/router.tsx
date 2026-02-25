import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute, RoleGuard } from '@/features/auth/ProtectedRoute';
import { Spinner } from '@/components/ui/Spinner';

// Lazy loaded pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('@/features/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('@/features/auth/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = lazy(() => import('@/features/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CheckinPage = lazy(() => import('@/features/checkin/CheckinPage').then(m => ({ default: m.CheckinPage })));
const InsightsPage = lazy(() => import('@/features/insights/InsightsPage').then(m => ({ default: m.InsightsPage })));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('@/features/admin/AdminPage').then(m => ({ default: m.AdminPage })));
const AskAIPage = lazy(() => import('@/features/ai/AskAIPage').then(m => ({ default: m.AskAIPage })));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Spinner size="lg" />
                </div>
            }
        >
            {children}
        </Suspense>
    );
}

export const router = createBrowserRouter([
    // Public routes
    {
        path: '/',
        element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
    },
    {
        path: '/login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
    },
    {
        path: '/signup',
        element: <SuspenseWrapper><SignupPage /></SuspenseWrapper>,
    },
    {
        path: '/forgot-password',
        element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
    },

    // Protected routes (authenticated)
    {
        element: (
            <ProtectedRoute>
                <AppShell />
            </ProtectedRoute>
        ),
        children: [
            {
                path: '/dashboard',
                element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
            },
            {
                path: '/checkin',
                element: <SuspenseWrapper><CheckinPage /></SuspenseWrapper>,
            },
            {
                path: '/insights',
                element: <SuspenseWrapper><InsightsPage /></SuspenseWrapper>,
            },
            {
                path: '/profile',
                element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
            },
            {
                path: '/settings',
                element: <SuspenseWrapper><ProfilePage /></SuspenseWrapper>,
            },
            {
                path: '/ask-ai',
                element: <SuspenseWrapper><AskAIPage /></SuspenseWrapper>,
            },
            // Admin routes
            {
                path: '/admin',
                element: (
                    <RoleGuard allowedRoles={['admin']}>
                        <SuspenseWrapper><AdminPage /></SuspenseWrapper>
                    </RoleGuard>
                ),
            },
        ],
    },

    // Catch-all
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
