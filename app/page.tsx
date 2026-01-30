import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export default async function Home() {
  const consultant = await prisma.user.findFirst({
    where: { role: Role.CONSULTANT }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <main className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-black text-pink-600 tracking-tighter">
          FARMASI SUPERAPP
        </h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto font-medium">
          A plataforma completa para consultores de alta performance.
          Gestão de estoque, loja virtual e CRM.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-pink-600 transition-all shadow-xl active:scale-95"
          >
            Acessar Painel
          </Link>
          <Link
            href={consultant ? `/store/${consultant.id}` : "/store"}
            className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-100 font-bold rounded-2xl hover:bg-pink-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            <span>🛍️</span> Ver Minha Loja
          </Link>
        </div>

        <div className="mt-12 p-8 bg-white border border-gray-100 shadow-2xl rounded-[2rem] text-left w-full max-w-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink-50 rounded-bl-full opacity-50 transition-all group-hover:w-24 group-hover:h-24"></div>
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
            <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
            Acesso de Demonstração
          </h3>
          <ul className="text-sm text-gray-600 space-y-3 font-semibold">
            <li className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
              <span>Líder: lider@farmasi.com</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">Manager</span>
            </li>
            <li className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
              <span>Consultora: consultora@farmasi.com</span>
              <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded uppercase">Personal</span>
            </li>
            <li className="text-center pt-2 italic text-[10px] text-gray-400">Senha padrão para ambos: <strong>password123</strong></li>
          </ul>
        </div>
      </main>
    </div>
  );
}
