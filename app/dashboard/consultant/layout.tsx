import Link from 'next/link';
import { ReactNode } from 'react';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export default async function DashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    const consultant = await prisma.user.findFirst({
        where: { role: Role.CONSULTANT }
    });

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-6">
                    <h1 className="text-2xl font-black text-pink-600 tracking-tighter">FARMASI</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Consultor Pro</p>
                </div>
                <nav className="mt-6">
                    <ul className="space-y-1">
                        <li>
                            <Link href="/dashboard/consultant" className="flex items-center px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-bold transition-all">
                                <span className="mr-3">📦</span> Estoque
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/consultant/catalog" className="flex items-center px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-bold transition-all">
                                <span className="mr-3">📖</span> Catálogo
                            </Link>
                        </li>
                        <li>
                            <Link href={consultant ? `/store/${consultant.id}` : "/store"} target="_blank" className="flex items-center px-6 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 font-bold transition-all">
                                <span className="mr-3">🛍️</span> Minha Loja ↗
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/consultant/orders" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium transition-all">
                                <span className="mr-3">💰</span> Pedidos
                            </Link>
                        </li>
                        <li>
                            <Link href="/dashboard/consultant/customers" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 font-medium transition-all">
                                <span className="mr-3">👥</span> Clientes
                            </Link>
                        </li>
                        <li className="pt-6 mt-6 border-t border-gray-100 px-6">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Liderança</span>
                        </li>
                        <li>
                            <Link href="/dashboard/leader" className="flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-bold transition-all">
                                <span className="mr-3">👑</span> Área do Líder
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-40 border-b border-gray-100">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Workspace</h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-pink-600 transition">🔔</button>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-pink-400 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-pink-200">
                            M
                        </div>
                    </div>
                </header>

                <main className="p-6 md:p-10 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
