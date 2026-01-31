import { prisma } from '@/lib/prisma';
import NetworkShowcase from '@/components/network/NetworkShowcase';
import RequestManager from '@/components/network/RequestManager';
import { getPartnerShowcase } from '@/app/actions/network';
import { getIncomingRequests } from '@/app/actions/collaboration';

export default async function NetworkPage() {
    const user = await prisma.user.findFirst({
        where: { email: 'lucas@vendaai.com' }
    }) || await prisma.user.findFirst();

    if (!user) return <div>Usuário não encontrado</div>;

    const result = await getPartnerShowcase(user.id);
    const incomingRequests = await getIncomingRequests(user.id);

    if (!result || !incomingRequests || (result as any).error) return <div>Erro ao carregar rede.</div>;

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                    <h1 className="text-3xl font-black mb-2">Vitrine Colaborativa 🤝</h1>
                    <p className="opacity-90 max-w-2xl">
                        Precisa de um produto com urgência e não tem?
                        Veja quem da sua rede (Líder ou Colegas) tem disponível e peça emprestado agora mesmo.
                    </p>
                    <div className="mt-6 flex gap-4">
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="block text-2xl font-bold">{result.networkSize}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Parceiros Conectados</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <span className="block text-2xl font-bold">{(result.items || []).length}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Produtos Únicos Disponíveis</span>
                        </div>
                    </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Incoming Requests (To Approve) */}
                    <RequestManager requests={incomingRequests} userId={user.id} />
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">🔎 Buscar na Rede</h2>
                    <NetworkShowcase items={result.items || []} userId={user.id} />
                </div>
            </div>
        </div>
    );
}
