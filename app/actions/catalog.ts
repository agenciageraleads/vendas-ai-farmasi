'use server';

import { prisma } from '@/lib/prisma';

export async function getGlobalCatalog() {
    return await prisma.product.findMany();
}

export async function addToInventory(productId: string, consultantEmail: string = 'consultora@farmasi.com') {
    const user = await prisma.user.findUnique({
        where: { email: consultantEmail }
    });

    if (!user) return { error: 'Usuário não encontrado' };

    try {
        // Check if already in inventory
        const existing = await prisma.inventoryItem.findFirst({
            where: {
                userId: user.id,
                productId: productId,
                location: 'Casa - Estoque' // Default location
            }
        });

        if (existing) {
            return { error: 'Produto já está no seu estoque. Ajuste a quantidade no painel.' };
        }

        await prisma.inventoryItem.create({
            data: {
                userId: user.id,
                productId: productId,
                quantity: 1,
                location: 'Casa - Estoque',
            }
        });

        return { success: true };
    } catch (error) {
        return { error: 'Falha ao adicionar ao estoque' };
    }
}
