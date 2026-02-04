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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-pink-600 p-8 text-white text-center">
                    <h1 className="text-3xl font-black mb-2">Bem-vinda ao VendaAI! 🚀</h1>
                    <p className="text-pink-100">Vamos configurar sua loja em 2 minutos. O que você já tem em mãos?</p>
                </div>

                <div className="p-8">
                    <StockSelection userId={user.id} products={products} />
                </div>
            </div>
        </div>
    );
}
