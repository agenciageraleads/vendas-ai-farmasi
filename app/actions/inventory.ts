'use server';

import { prisma } from '@/lib/prisma';

export async function getConsultantInventory(consultantEmail: string = 'consultora@farmasi.com') {
    // 1. Find the user
    const user = await prisma.user.findUnique({
        where: { email: consultantEmail },
        include: {
            inventory: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!user) return { error: 'Consultor não encontrado' };

    return {
        inventory: user.inventory.map(item => ({
            ...item,
            product: {
                ...item.product,
                basePrice: Number(item.product.basePrice),
                costPrice: Number(item.product.costPrice),
            }
        })),
        consultantName: user.name
    };
}

export async function getInventorySummary(consultantEmail: string = 'consultora@farmasi.com') {
    const user = await prisma.user.findUnique({
        where: { email: consultantEmail },
        include: {
            inventory: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!user) return { totalItems: 0, totalValue: 0, lowStock: 0 };

    const totalItems = user.inventory.reduce((acc, item) => acc + item.quantity, 0);
    const totalValue = user.inventory.reduce((acc, item) => {
        // Value based on basePrice (sales potential)
        return acc + (Number(item.product.basePrice) * item.quantity);
    }, 0);

    return {
        totalItems,
        totalValue,
        lowStock: user.inventory.filter(i => i.quantity < 3).length
    };
}

export async function updateInventoryItem(id: string, data: { quantity?: number, location?: string, openedAt?: Date }) {
    try {
        const updated = await prisma.inventoryItem.update({
            where: { id },
            data: {
                quantity: data.quantity,
                location: data.location,
                openedAt: data.openedAt,
            }
        });
        return { success: true, item: updated };
    } catch (error) {
        console.error('Error updating inventory:', error);
        return { error: 'Falha ao atualizar estoque' };
    }
}

export async function openSample(id: string) {
    try {
        const updated = await prisma.inventoryItem.update({
            where: { id },
            data: {
                openedAt: new Date(),
                isSample: true, // Auto mark as sample if opened
            }
        });
        return { success: true, item: updated };
    } catch (error) {
        return { error: 'Falha ao abrir amostra' };
    }
}

export async function getActionDataBySku(sku: string, consultantEmail: string = 'consultora@farmasi.com') {
    const user = await prisma.user.findUnique({
        where: { email: consultantEmail }
    });

    if (!user) return { error: 'Usuário não encontrado' };

    const product = await prisma.product.findUnique({
        where: { sku: sku }
    });

    if (!product) return { error: 'Produto não encontrado no catálogo.' };

    const inventoryItem = await prisma.inventoryItem.findFirst({
        where: {
            userId: user.id,
            productId: product.id
        }
    });

    return {
        product: {
            ...product,
            basePrice: Number(product.basePrice),
            costPrice: Number(product.costPrice),
        },
        inventoryItem,
        userId: user.id
    };
}
