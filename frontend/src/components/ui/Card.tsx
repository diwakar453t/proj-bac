import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    hover?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

const paddings = {
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};

export function Card({
    children,
    hover = false,
    padding = 'md',
    className = '',
    ...props
}: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.08)' } : undefined}
            className={`
        bg-surface-light dark:bg-surface-dark
        rounded-2xl border border-border-light dark:border-border-dark
        card-shadow transition-all duration-200
        ${paddings[padding]}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
}
