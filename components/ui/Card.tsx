import React from 'react';

type CardVariant = 'default' | 'compact' | 'elevated';

interface CardProps {
    variant?: CardVariant;
    hover?: boolean;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

/**
 * Componente Card seguindo design system VendaAI
 * Variantes: default, compact, elevated
 * Suporta hover effect com translateY e shadow
 */
export default function Card({
    variant = 'default',
    hover = false,
    children,
    className = '',
    onClick,
}: CardProps) {
    // Classes base
    const baseClasses = 'bg-[var(--bg-primary)] border border-gray-100 transition-all duration-300 ease-out';

    // Classes de variante
    const variantClasses: Record<CardVariant, string> = {
        default: 'rounded-2xl p-6 shadow-[var(--shadow-md)]',
        compact: 'rounded-xl p-4 shadow-[var(--shadow-sm)]',
        elevated: 'rounded-2xl p-6 shadow-[var(--shadow-lg)]',
    };

    // Classes de hover
    const hoverClasses = hover
        ? 'hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 cursor-pointer'
        : '';

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

    return (
        <div className={combinedClasses} onClick={onClick}>
            {children}
        </div>
    );
}
