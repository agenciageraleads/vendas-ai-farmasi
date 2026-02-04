import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Verificação de autenticação (mock)
    const user = await prisma.user.findFirst({
        where: { email: 'lucas@vendaai.com' }
    }) || await prisma.user.findFirst();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
            <div className="px-[var(--screen-padding)] py-6">
                {children}
            </div>
            <BottomNav />
        </div>
    );
}
