import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
}

/**
 * Componente Input seguindo design system VendaAI
 * Suporta label, error, helper text e ícones leading/trailing
 */
export default function Input({
    label,
    error,
    helperText,
    leadingIcon,
    trailingIcon,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    // Classes do input
    const baseClasses = 'w-full px-4 py-3 rounded-lg border-2 text-[var(--text-base)] transition-all duration-200 ease-out bg-[var(--bg-primary)]';
    const stateClasses = error
        ? 'border-[var(--error)] focus:border-[var(--error)] focus:ring-4 focus:ring-[var(--error-bg)]'
        : 'border-[var(--bg-tertiary)] focus:border-[var(--primary-500)] focus:ring-4 focus:ring-[rgba(106,77,253,0.1)]';
    const iconPadding = leadingIcon ? 'pl-12' : trailingIcon ? 'pr-12' : '';

    const combinedClasses = `${baseClasses} ${stateClasses} ${iconPadding} ${className}`;

    return (
        <div className="w-full">
            {/* Label */}
            {label && (
                <label
                    htmlFor={inputId}
                    className="block mb-2 text-[var(--text-sm)] font-semibold text-[var(--text-primary)]"
                >
                    {label}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Leading Icon */}
                {leadingIcon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        {leadingIcon}
                    </div>
                )}

                {/* Input */}
                <input
                    id={inputId}
                    className={combinedClasses}
                    {...props}
                />

                {/* Trailing Icon */}
                {trailingIcon && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                        {trailingIcon}
                    </div>
                )}
            </div>

            {/* Error ou Helper Text */}
            {error && (
                <p className="mt-2 text-[var(--text-sm)] text-[var(--error)]">
                    {error}
                </p>
            )}
            {!error && helperText && (
                <p className="mt-2 text-[var(--text-sm)] text-[var(--text-tertiary)]">
                    {helperText}
                </p>
            )}
        </div>
    );
}
