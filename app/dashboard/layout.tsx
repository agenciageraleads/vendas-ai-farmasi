export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Mock */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col flex-shrink-0">
                <div className="p-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tighter italic">Venda<span className="text-pink-600">AI</span></h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <a href="/dashboard/inventory" className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition">
                        📦 Estoque
                    </a>
                    <a href="/dashboard/network/showcase" className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition">
                        🤝 Rede Colaborativa
                    </a>
                    <a href="/dashboard/sales/new" className="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-black transition">
                        🛍️ Nova Venda (PDV)
                    </a>
                </nav>

                <div className="p-4 border-t border-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center font-bold text-pink-600">L</div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Lucas</p>
                            <p className="text-xs text-gray-400">Consultor Elite</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
