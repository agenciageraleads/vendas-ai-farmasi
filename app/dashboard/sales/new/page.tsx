import { prisma } from '@/lib/prisma';
import POSForm from '@/components/sales/POSForm';

export default async function NewSalePage() {
    const user = await prisma.user.findFirst({
        where: { email: 'lucas@vendaai.com' }
    }) || await prisma.user.findFirst();

    if (!user) return <div>Usuário não encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nova Venda 🛍️</h1>
                        <p className="text-gray-500 font-medium">PDV: Selecione produtos, cadastre o cliente e gere a cobrança.</p>
                    </div>
                </div>

                <POSForm userId={user.id} />

            </div>
        </div>
    );
}
