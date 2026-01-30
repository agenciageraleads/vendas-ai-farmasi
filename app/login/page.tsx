'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual auth
        if (email === 'lider@farmasi.com') {
            router.push('/dashboard/leader');
        } else if (email === 'consultora@farmasi.com') {
            router.push('/dashboard/consultant');
        } else {
            alert('Credenciais inválidas! Tente as de teste.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-xl">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Acessar Conta</h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Entrar
                    </button>
                </form>

                <div className="mt-6 text-xs text-gray-500 bg-gray-100 p-3 rounded">
                    <p className="font-semibold">Credenciais de Teste:</p>
                    <p>Líder: lider@farmasi.com / password123</p>
                    <p>Consultora: consultora@farmasi.com / password123</p>
                </div>
            </div>
        </div>
    );
}
