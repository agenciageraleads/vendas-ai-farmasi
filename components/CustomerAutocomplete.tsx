'use client';

import { useState, useEffect } from 'react';
import { searchCustomers } from '@/app/actions/customers';

interface Customer {
    id: string;
    name: string | null;
    cpf: string | null;
    phone: string | null;
    email: string;
}

interface CustomerAutocompleteProps {
    onSelect: (customer: Customer) => void;
    placeholder?: string;
    initialValue?: string;
}

/**
 * Componente de autocomplete para busca de clientes
 * Busca por nome, CPF ou telefone com debounce
 */
export default function CustomerAutocomplete({
    onSelect,
    placeholder = 'Buscar cliente por nome, CPF ou telefone...',
    initialValue = ''
}: CustomerAutocompleteProps) {
    const [query, setQuery] = useState(initialValue);
    const [results, setResults] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Debounce da busca
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                const customers = await searchCustomers(query);
                setResults(customers);
                setLoading(false);
                setShowResults(true);
            } else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (customer: Customer) => {
        onSelect(customer);
        setQuery(customer.name || customer.email);
        setResults([]);
        setShowResults(false);
    };

    const formatCPF = (cpf: string | null) => {
        if (!cpf) return '';
        // Formatar CPF: 000.000.000-00
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const formatPhone = (phone: string | null) => {
        if (!phone) return '';
        // Formatar telefone: (00) 00000-0000
        return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setShowResults(true)}
                    placeholder={placeholder}
                    className="w-full p-3 bg-gray-50 rounded-lg border-none text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none pr-10"
                />

                {/* Loading spinner */}
                {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    </div>
                )}

                {/* Ícone de busca */}
                {!loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Resultados */}
            {showResults && results.length > 0 && (
                <div className="absolute z-10 w-full bg-white shadow-xl rounded-xl mt-2 overflow-hidden border border-gray-100 max-h-64 overflow-y-auto">
                    {results.map((customer) => (
                        <div
                            key={customer.id}
                            onClick={() => handleSelect(customer)}
                            className="p-3 hover:bg-primary-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition"
                        >
                            <p className="font-bold text-sm text-gray-800">
                                {customer.name || 'Sem nome cadastrado'}
                            </p>
                            <div className="flex gap-3 text-xs text-gray-500 mt-1">
                                {customer.cpf && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                        </svg>
                                        {formatCPF(customer.cpf)}
                                    </span>
                                )}
                                {customer.phone && (
                                    <span className="flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                        {formatPhone(customer.phone)}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mensagem quando não há resultados */}
            {showResults && query.length >= 2 && results.length === 0 && !loading && (
                <div className="absolute z-10 w-full bg-white shadow-xl rounded-xl mt-2 p-4 border border-gray-100">
                    <p className="text-sm text-gray-500 text-center">
                        Nenhum cliente encontrado. Cadastre um novo cliente.
                    </p>
                </div>
            )}
        </div>
    );
}
