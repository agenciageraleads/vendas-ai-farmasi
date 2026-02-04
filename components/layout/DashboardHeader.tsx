import Link from 'next/link';

export default function DashboardHeader() {
    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-6">
            <div className="px-[var(--screen-padding)] py-4">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    {/* Logo/Ícone */}
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                        <span className="text-white font-black text-xl">V</span>
                    </div>

                    {/* Nome do App */}
                    <div>
                        <h1 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                            VendaAI
                        </h1>
                        <p className="text-xs text-gray-500 font-medium">Farmasi</p>
                    </div>
                </Link>
            </div>
        </header>
    );
}
