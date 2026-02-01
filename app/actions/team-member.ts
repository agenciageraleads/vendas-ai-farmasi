'use server';

import { prisma } from '@/lib/prisma';

export async function getTeamMemberDetails(memberId: string) {
    const member = await prisma.user.findUnique({
        where: { id: memberId },
        include: {
            inventory: {
                include: {
                    product: true
                }
            },
            sales: {
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!member) return null;

    return {
        ...member,
        name: member.name || 'Consultor',
        inventory: member.inventory.map(i => ({
            ...i,
            product: {
                ...i.product,
                basePrice: Number(i.product.basePrice),
                costPrice: Number(i.product.costPrice)
            }
        })),
        sales: member.sales.map(s => ({
            ...s,
            total: Number(s.total)
        }))
    };
}
