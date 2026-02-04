'use server';

import { prisma } from '@/lib/prisma';
import { addDays, differenceInDays, format } from 'date-fns';

export interface Opportunity {
    id: string; // OrderItem ID
    clientName: string;
    clientPhone: string | null;
    productName: string;
    lastPurchaseDate: Date;
    daysSincePurchase: number;
    usageDuration: number;
    status: 'URGENT' | 'SOON' | 'LATE';
}

export async function getDailyOpportunities(userId: string): Promise<Opportunity[]> {
    try {
        // 1. Fetch sales that might be expiring
        // Na prática, buscaríamos pedidos dos últimos X meses.
        // Aqui pegamos TUDO e filtramos na memória por ser MVP (Dataset pequeno)
        const sales = await prisma.orderItem.findMany({
            where: {
                order: { sellerId: userId, status: 'PAID' }
            },
            include: {
                product: true,
                order: {
                    select: { customerName: true, customerPhone: true, createdAt: true }
                }
            },
            orderBy: { order: { createdAt: 'desc' } }
        });

        const opportunities: Opportunity[] = [];
        const today = new Date();

        for (const item of sales) {
            const purchaseDate = item.order.createdAt;
            const duration = item.product.usageDuration || 30; // Default 30 days

            // Data prevista de fim = Compra + Duração
            const expectedEndDate = addDays(purchaseDate, duration);

            // Dias restantes para acabar
            const daysUntilEnd = differenceInDays(expectedEndDate, today);

            // Lógica de Janela de Oportunidade:
            // - Acaba em 5 dias ou menos (SOON)
            // - Já acabou há menos de 10 dias (URGENT)
            // - Ignorar se acabou há muito tempo (LATE/LOST)

            let status: 'URGENT' | 'SOON' | 'LATE' | null = null;

            if (daysUntilEnd <= 5 && daysUntilEnd >= 0) status = 'SOON';
            else if (daysUntilEnd < 0 && daysUntilEnd > -15) status = 'URGENT'; // Até 15 dias de atraso

            if (status) {
                opportunities.push({
                    id: item.id,
                    clientName: item.order.customerName || 'Cliente sem nome',
                    clientPhone: item.order.customerPhone,
                    productName: item.product.name,
                    lastPurchaseDate: purchaseDate,
                    daysSincePurchase: differenceInDays(today, purchaseDate),
                    usageDuration: duration,
                    status
                });
            }
        }

        // Sort by urgency
        return opportunities.sort((a, b) => {
            if (a.status === 'URGENT' && b.status !== 'URGENT') return -1;
            return 0;
        });

    } catch (error) {
        console.error('CRM Error:', error);
        return [];
    }
}
