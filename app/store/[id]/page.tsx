import { getStoreData } from '@/app/actions/store';
import Link from 'next/link';
import StoreClient from '@/components/StoreClient';

export default async function ConsultantStorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const storeData = await getStoreData(id);

    if (!storeData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold">Loja não encontrada</h1>
                <Link href="/" className="text-pink-600 mt-4 hover:underline">Voltar para Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Premium Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black text-pink-600 tracking-tighter italic">FARMASI</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Consultor(a) {storeData.consultantName}</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-6 text-sm font-black text-gray-400 uppercase tracking-widest">
                            <Link href="#" className="hover:text-pink-600 transition">Make</Link>
                            <Link href="#" className="hover:text-pink-600 transition">Skin</Link>
                            <Link href="#" className="hover:text-pink-600 transition">Bio</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gray-900 py-20 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/20 to-transparent" />
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none italic uppercase">Beleza que <br /> Transforma ✨</h2>
                    <p className="text-gray-400 max-w-xl mx-auto font-medium">
                        Os melhores produtos da Farmasi selecionados por <span className="text-white underline decoration-pink-500 underline-offset-4">{storeData.consultantName}</span>.
                    </p>
                </div>
            </section>

            {/* Product Grid */}
            <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex-1">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-[0.3em] mb-12 text-center md:text-left">
                    Destaques em Estoque Pronta Entrega
                </h3>

                <StoreClient
                    products={storeData.products}
                    consultantId={id}
                    consultantName={storeData.consultantName}
                />

                {storeData.products.length === 0 && (
                    <div className="col-span-full py-20 text-center">
                        <p className="text-gray-400 font-medium">Ops! Nossos produtos acabaram de voar das prateleiras.</p>
                        <p className="text-sm text-gray-500 mt-2">Fale com {storeData.consultantName} para encomendar.</p>
                    </div>
                )}
            </main>

            <footer className="bg-white border-t border-gray-100 py-16 px-4">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div>
                        <h5 className="text-pink-600 font-black text-lg mb-4 italic tracking-tighter">FARMASI / {storeData.consultantName}</h5>
                        <p className="text-xs text-gray-400 font-bold leading-relaxed uppercase tracking-widest">Sua consultora independente Farmasi. <br /> Levando beleza para todo o Brasil.</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h5 className="text-gray-900 font-black mb-4 uppercase text-[10px] tracking-widest bg-gray-50 w-fit px-2 py-1">Atendimento</h5>
                        <Link href="#" className="text-sm font-bold text-gray-500 hover:text-pink-600 transition">WhatsApp 📱</Link>
                        <Link href="#" className="text-sm font-bold text-gray-500 hover:text-pink-600 transition">Políticas de Entrega</Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h5 className="text-gray-900 font-black mb-4 uppercase text-[10px] tracking-widest bg-gray-50 w-fit px-2 py-1">Segurança</h5>
                        <div className="flex gap-4 grayscale opacity-30 mt-2">
                            <span className="text-2xl">💳</span>
                            <span className="text-2xl">🔒</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
