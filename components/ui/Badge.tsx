import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    children: React.ReactNode;
    className?: string;
}

/**
 * Componente Badge para status e categorias
 * Variantes: success, warning, error, info, neutral
 * Tamanhos: sm, md
 */
export default function Badge({
    variant = 'neutral',
    size = 'sm',
    children,
    className = '',
}: BadgeProps) {
    // Classes base
    const baseClasses = 'inline-flex items-center rounded-full font-bold uppercase tracking-wide';

    // Classes de variante
    const variantClasses: Record<BadgeVariant, string> = {
        success: 'bg-[var(--success-bg)] text-[var(--success)]',
        warning: 'bg-[var(--warning-bg)] text-[var(--warning)]',
        error: 'bg-[var(--error-bg)] text-[var(--error)]',
        info: 'bg-[var(--info-bg)] text-[var(--info)]',
        neutral: 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]',
    };

    // Classes de tamanho
    const sizeClasses: Record<BadgeSize, string> = {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-3 py-1 text-[var(--text-xs)]',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return <span className={combinedClasses}>{children}</span>;
}
