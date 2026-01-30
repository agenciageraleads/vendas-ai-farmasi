import Link from 'next/link';

export default function StorePage() {
    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900">Loja da Maria</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">Carrinho (0)</span>
                        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">Sou Consultor</Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Mock Product Cards */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="group relative border rounded-lg p-4 hover:shadow-lg transition">
                            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-56">
                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                    Imagem Produto
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm text-gray-700">
                                        <a href="#">
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            Produto Exemplo {i}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">Categoria</p>
                                </div>
                                <p className="text-sm font-medium text-gray-900">R$ 59,90</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
