'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay for "feel"
        await new Promise(resolve => setTimeout(resolve, 800));

        // TODO: Implement actual auth
        if (email === 'lider@farmasi.com') {
            router.push('/dashboard/leader');
        } else if (email === 'consultora@farmasi.com') {
            router.push('/dashboard/inventory');
        } else {
            alert('Credenciais inválidas! Tente as de teste.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-500 to-accent-400 p-4">
            <div className="max-w-md w-full bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden transform transition-all hover:scale-[1.01] duration-500">
                <div className="p-8 sm:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Bem-vinda de volta! 👋</h1>
                        <p className="text-gray-500">Digite suas credenciais para acessar o VendaAI.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Email</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transform transition active:scale-95 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Entrar na Plataforma'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">🚀 Ambiente de Teste</p>
                            <div className="space-y-1 text-sm text-blue-700 cursor-pointer" onClick={() => { setEmail('consultora@farmasi.com'); setPassword('password123'); }}>
                                <p><span className="font-semibold">Consultora:</span> consultora@farmasi.com</p>
                                <p><span className="font-semibold">Senha:</span> password123</p>
                                <p className="text-xs mt-1 opacity-70">(Clique para preencher)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
