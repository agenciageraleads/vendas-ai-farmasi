import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import StockSelection from './steps/StockSelection';

export default async function SetupPage() {
    // Mock Auth
    const user = await prisma.user.findFirst({
        where: { email: 'consultora@farmasi.com' } // Using the seed user
    }) || await prisma.user.findFirst();

    if (!user) return <div>Erro: Usuário não encontrado.</div>;

    if (user.onboardingCompleted) {
        redirect('/dashboard/inventory');
    }

    // Fetch all products for the selection grid
    const products = await prisma.product.findMany({
        orderBy: { name: 'asc' }
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header Clean */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
                            V
                        </div>
                        <span className="font-bold text-gray-900 tracking-tight">VendaAI Setup</span>
                    </div>
                    <div className="text-sm text-gray-500 font-medium">
                        Passo 1 de 1
                    </div>
                </div>
            </div>

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
                <div className="text-center max-w-2xl mx-auto mb-8 fade-in">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">Vamos montar seu estoque? 📦</h1>
                    <p className="text-lg text-gray-500">Selecione os produtos que você já tem em mãos para começarmos a vender.</p>
                </div>

                <StockSelection userId={user.id} products={products} />
            </main>
        </div>
    );
}
