'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function completeOnboarding(userId: string, initialStock: { sku: string; quantity: number }[]) {
    try {
        // 1. Mark user as onboarded
        await prisma.user.update({
            where: { id: userId },
            data: { onboardingCompleted: true }
        });

        // 2. Add initial stock
        if (initialStock.length > 0) {
            const products = await prisma.product.findMany({
                where: { sku: { in: initialStock.map(i => i.sku) } }
            });

            for (const item of initialStock) {
                const product = products.find(p => p.sku === item.sku);
                if (product) {
                    await prisma.inventoryItem.create({
                        data: {
                            userId,
                            productId: product.id,
                            quantity: item.quantity,
                            location: 'Casa', // Default location
                            costAmount: Number(product.basePrice) * 0.7 * item.quantity // Estimating cost as 70% of base
                        }
                    });
                }
            }
        }

        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Onboarding Error:', error);
        return { success: false, error: 'Falha ao concluir configuração.' };
    }
}
