import React from 'react';

// Tipos de variantes de botão
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children: React.ReactNode;
}

/**
 * Componente de botão seguindo design system VendaAI
 * Variantes: primary (roxo), secondary (rosa), outline, ghost
 * Tamanhos: sm, md, lg
 */
export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    // Classes base
    const baseClasses = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed';

    // Classes de variante
    const variantClasses: Record<ButtonVariant, string> = {
        primary: 'bg-[var(--primary-500)] text-[var(--text-inverse)] hover:bg-[var(--primary-600)] active:scale-[0.98] shadow-[var(--shadow-primary)]',
        secondary: 'bg-[var(--accent-500)] text-[var(--text-inverse)] hover:bg-[var(--accent-600)] active:scale-[0.98] shadow-[var(--shadow-accent)]',
        outline: 'bg-transparent text-[var(--primary-500)] border-2 border-[var(--primary-500)] hover:bg-[var(--primary-500)] hover:text-[var(--text-inverse)]',
        ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]',
    };

    // Classes de tamanho
    const sizeClasses: Record<ButtonSize, string> = {
        sm: 'px-4 py-2 text-[var(--text-sm)]',
        md: 'px-6 py-3 text-[var(--text-base)]',
        lg: 'px-8 py-4 text-[var(--text-lg)]',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
        <button
            className={combinedClasses}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Carregando...
                </>
            ) : (
                children
            )}
        </button>
    );
}
