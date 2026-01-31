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

        // DEPRECATED: This simple logic doesn't support the new costAmount schema perfectly
        // but keeping it for backward compatibility if needed.
        // Prefer using 'addStock' from inventory.ts
        await prisma.inventoryItem.create({
            data: {
                userId: user.id,
                productId: productId,
                quantity: 1,
                location: 'Casa - Estoque',
                costAmount: 0 // Default, should be updated
            }
        });

        return { success: true };
    } catch (error) {
        return { error: 'Falha ao adicionar ao estoque' };
    }
}

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    return await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { sku: { contains: query, mode: 'insensitive' } }
            ]
        },
        take: 10,
        select: {
            id: true,
            name: true,
            sku: true,
            imageUrl: true,
            basePrice: true,
            costPrice: true
        }
    });
}
