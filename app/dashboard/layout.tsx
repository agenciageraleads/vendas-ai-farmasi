import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import BottomNav from '@/components/layout/BottomNav';
import DashboardHeader from '@/components/layout/DashboardHeader';

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
            <DashboardHeader />
            <div className="px-[var(--screen-padding)] pb-24">
                {children}
            </div>
            <BottomNav />
        </div>
    );
}
