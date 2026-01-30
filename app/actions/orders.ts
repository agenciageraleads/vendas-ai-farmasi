'use server';

import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function createOrder(data: {
    sellerId: string,
    customerName: string,
    customerPhone: string,
    items: { productId: string, quantity: number, unitPrice: number }[]
}) {
    try {
        const total = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

        const order = await prisma.order.create({
            data: {
                sellerId: data.sellerId,
                customerName: data.customerName,
                customerPhone: data.customerPhone,
                status: OrderStatus.PENDING,
                total: total,
                items: {
                    create: data.items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                    }))
                }
            }
        });

        // Reduce inventory quantity
        for (const item of data.items) {
            const invItem = await prisma.inventoryItem.findFirst({
                where: {
                    userId: data.sellerId,
                    productId: item.productId,
                    quantity: { gte: item.quantity },
                }
            });

            if (invItem) {
                await prisma.inventoryItem.update({
                    where: { id: invItem.id },
                    data: {
                        quantity: { decrement: item.quantity }
                    }
                });
            }
        }

        return { success: true, orderId: order.id };
    } catch (error) {
        console.error('Error creating order:', error);
        return { error: 'Falha ao processar pedido' };
    }
}
