'use server';

import { prisma } from '@/lib/prisma';

export async function getPartnerShowcase(userId: string) {
    if (!userId) return null;

    // 1. Find the user (to get leaderId)
    // 2. Find active connections (partners) - For MVP, let's assume TEAM members can see each other + Leader

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            leader: true
        }
    });

    if (!user) return { error: 'Usuário não encontrado' };

    // Define "Network" = Leader + Peers (Same leader)
    // For MVP efficiency: Fetch ALL users linked to same LEADER (Peers) + The LEADER's inventory
    const networkIds = [];
    if (user.leaderId) {
        networkIds.push(user.leaderId); // Add Leader

        // Find Peers
        const peers = await prisma.user.findMany({
            where: {
                leaderId: user.leaderId,
                id: { not: user.id } // Exclude self
            },
            select: { id: true }
        });
        peers.forEach(p => networkIds.push(p.id));
    }

    // Logic for Leaders who want to see their Team's stock?
    // "Vitrine Compartilhada": Usually implies looking for stock to BORROW.
    // So searching across the network is key.

    // Let's fetch available items across the network (Quantity > 0)
    // Grouped by Product
    const networkInventory = await prisma.inventoryItem.findMany({
        where: {
            userId: { in: networkIds },
            quantity: { gt: 0 }
        },
        include: {
            product: true,
            user: {
                select: { id: true, name: true, email: true }
            }
        },
        orderBy: {
            product: { name: 'asc' }
        }
    });

    // Transform for UI: Group by Product
    const showcaseMap = new Map();

    networkInventory.forEach(item => {
        if (!showcaseMap.has(item.productId)) {
            showcaseMap.set(item.productId, {
                productId: item.productId,
                productName: item.product.name,
                sku: item.product.sku,
                imageUrl: item.product.imageUrl,
                basePrice: Number(item.product.basePrice),
                holders: [] // Who has this item?
            });
        }

        const productEntry = showcaseMap.get(item.productId);
        productEntry.holders.push({
            userId: item.user.id,
            userName: item.user.name || 'Consultor',
            quantity: item.quantity,
            location: item.location
        });
    });

    return {
        networkSize: networkIds.length,
        items: Array.from(showcaseMap.values())
    };
}
