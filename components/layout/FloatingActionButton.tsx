import React from 'react';
import Link from 'next/link';

interface FABProps {
    href?: string;
    onClick?: () => void;
    icon?: string;
    label?: string;
}

/**
 * Floating Action Button
 * Botão circular fixo no canto inferior direito
 * Para ação principal da tela (ex: Nova Venda)
 */
export default function FloatingActionButton({
    href,
    onClick,
    icon = '+',
    label,
}: FABProps) {
    const buttonClasses = `
    fixed bottom-20 right-4 z-40
    w-14 h-14 rounded-full
    bg-[var(--accent-500)] text-[var(--text-inverse)]
    shadow-[var(--shadow-xl)]
    flex items-center justify-center
    text-2xl font-bold
    transition-all duration-200 ease-out
    hover:scale-110 hover:shadow-[var(--shadow-accent)]
    active:scale-95
  `;

    if (href) {
        return (
            <Link href={href} className={buttonClasses} title={label}>
                {icon}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses} title={label}>
            {icon}
        </button>
    );
}
