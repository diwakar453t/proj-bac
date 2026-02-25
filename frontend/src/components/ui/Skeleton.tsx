interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string;
    height?: string;
}

export function Skeleton({ className = '', variant = 'text', width, height }: SkeletonProps) {
    const baseClasses = 'animate-pulse bg-gray-200 dark:bg-slate-700';

    const variantClasses = {
        text: 'rounded-md h-4',
        circular: 'rounded-full',
        rectangular: 'rounded-xl',
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ width, height }}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark p-5 space-y-3">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="rectangular" height="80px" />
        </div>
    );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                    <Skeleton variant="circular" width="40px" height="40px" />
                    <div className="flex-1 space-y-2">
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                </div>
            ))}
        </div>
    );
}
