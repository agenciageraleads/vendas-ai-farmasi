'use server';

import { prisma } from '@/lib/prisma';

export async function getLeaderData(leaderEmail: string = 'lider@farmasi.com') {
    const leader = await prisma.user.findUnique({
        where: { email: leaderEmail },
        include: {
            team: {
                include: {
                    inventory: {
                        include: {
                            product: true
                        }
                    },
                    sales: true
                }
            }
        }
    });

    if (!leader) return null;

    const teamData = leader.team.map(member => {
        const totalInventoryValue = member.inventory.reduce((acc, item) => {
            return acc + (Number(item.product.basePrice) * item.quantity);
        }, 0);

        const openSamples = member.inventory.filter(i => (i as any).openedAt !== null).length;
        const lowStockItems = member.inventory.filter(i => i.quantity < 3).length;
        const totalSalesValue = member.sales.reduce((acc, order) => acc + Number(order.total), 0);

        return {
            id: member.id,
            name: member.name || 'Consultor',
            consultantName: member.name || 'Consultor Farmasi', // Added consultantName with fallback
            email: member.email,
            inventoryValue: totalInventoryValue,
            itemsCount: member.inventory.reduce((acc, item) => acc + item.quantity, 0),
            openSamples,
            lowStockItems,
            totalSalesValue,
            totalSalesCount: member.sales.length,
            activityLevel: (totalInventoryValue > 0 || totalSalesValue > 0) ? 'Ativo' : 'Inativo',
        };
    });

    const teamTotalValue = teamData.reduce((acc, m) => acc + m.inventoryValue, 0);
    const teamTotalSales = teamData.reduce((acc, m) => acc + m.totalSalesValue, 0);
    const teamTotalLowStock = teamData.reduce((acc, m) => acc + m.lowStockItems, 0);

    // Get top 3 products in team inventory (by quantity)
    const productCounts: Record<string, { name: string, qty: number }> = {};
    leader.team.forEach(member => {
        member.inventory.forEach(item => {
            if (!productCounts[item.productId]) {
                productCounts[item.productId] = { name: item.product.name, qty: 0 };
            }
            productCounts[item.productId].qty += item.quantity;
        });
    });

    const topProducts = Object.values(productCounts)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 3);

    return {
        leaderName: leader.name || 'Líder Farmasi',
        teamSize: leader.team.length,
        teamTotalValue,
        teamTotalSales,
        teamTotalLowStock,
        topProducts,
        teamMembers: teamData
    };
}
