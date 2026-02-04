'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
    href: string;
    icon: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: '/dashboard', icon: '🛫', label: 'Cockpit' },
    { href: '/dashboard/sales', icon: '💰', label: 'Vendas' },
    { href: '/dashboard/inventory', icon: '📦', label: 'Estoque' },
    { href: '/dashboard/network', icon: '🤝', label: 'Rede' },
];

/**
 * Navegação inferior mobile-first
 * Fixed na parte inferior da tela
 * Destaca item ativo com cor primária
 */
export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-gray-100 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-around items-center px-4 py-3 max-w-7xl mx-auto">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${active ? 'text-[var(--primary-500)]' : 'text-[var(--text-tertiary)]'
                                }`}
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <span className={`text-[10px] font-medium ${active ? 'font-bold' : ''}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
