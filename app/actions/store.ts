'use server';

import { prisma } from '@/lib/prisma';

export async function getStoreData(consultantId: string) {
    const user = await prisma.user.findUnique({
        where: { id: consultantId },
        include: {
            inventory: {
                where: {
                    quantity: { gt: 0 },
                    isSample: false, // Don't sell samples in the store
                },
                include: {
                    product: true
                }
            }
        }
    });

    if (!user) return null;

    return {
        consultantName: user.name || 'Consultor Farmasi',
        products: user.inventory.map(item => ({
            id: item.product.id,
            name: item.product.name,
            sku: item.product.sku,
            price: Number(item.product.basePrice), // Use base price for now
            image: item.product.imageUrl,
            stock: item.quantity,
        }))
    };
}
