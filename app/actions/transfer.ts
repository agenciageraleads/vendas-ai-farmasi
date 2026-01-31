'use server';

import { prisma } from '@/lib/prisma';
import { moveStock } from '@/app/actions/inventory';

export async function transferStockAction(
    userId: string,
    sku: string,
    quantity: number,
    fromLocation: string,
    toLocation: string
) {
    if (!userId || !sku || !quantity || !fromLocation || !toLocation) {
        return { error: 'Dados incompletos para transferência.' };
    }

    if (fromLocation === toLocation) {
        return { error: 'Origem e destino devem ser diferentes.' };
    }

    try {
        await moveStock(userId, sku, quantity, fromLocation, toLocation);
        return { success: true };
    } catch (error: any) {
        console.error('Transfer Error:', error);
        return { error: error.message || 'Erro ao realizar transferência.' };
    }
}
