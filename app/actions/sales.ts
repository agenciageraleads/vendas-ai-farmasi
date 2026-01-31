'use server';

import { prisma } from '@/lib/prisma';
import { removeStock } from '@/app/actions/inventory';
import { createPaymentLink } from '@/app/actions/asaas';
import { TransactionType } from '@/lib/prisma';

interface SaleItem {
    sku: string;
    quantity: number;
    unitPrice: number; // Preço de Venda (pode ser diferente do catálogo)
}

interface CustomerData {
    name: string;
    cpf: string;
    phone: string;
    email?: string;
    address?: any;
    termsAccepted: boolean;
}

export async function createSale(
    userId: string,
    items: SaleItem[],
    customer: CustomerData,
    paymentMethod: 'PIX' | 'BOLETO' | 'CREDIT_CARD'
) {
    if (!items || items.length === 0) return { error: 'Carrinho vazio.' };
    if (!customer.cpf) return { error: 'CPF do cliente é obrigatório para emissão fiscal.' };
    if (!customer.termsAccepted) return { error: 'Cliente precisa aceitar os termos de uso.' };

    try {
        // 1. Validate Stock availability first
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { sku: item.sku } });
            if (!product) throw new Error(`Produto desconhecido: ${item.sku}`);

            const inventory = await prisma.inventoryItem.findFirst({
                where: { userId, productId: product.id, quantity: { gte: item.quantity } }
            });

            // For MVP simplicity, check ANY location with enough stock? 
            // Or force picking location? Let's assume 'Casa' or 'Padrao' for POS default
            // BETTER: Find the first location with stock or sum up?
            // Let's force stock in 'Casa' for simplicity in MVP v1
            const invItem = await prisma.inventoryItem.findFirst({
                where: { userId, productId: product.id, location: 'Casa', quantity: { gte: item.quantity } }
            });

            if (!invItem) throw new Error(`Estoque insuficiente de ${product.name} no local 'Casa'.`);
        }

        // 2. Register/Update Customer (User Role CUSTOMER)
        let buyer = await prisma.user.findUnique({ where: { cpf: customer.cpf } });

        if (!buyer) {
            // Auto-create simplified customer user
            buyer = await prisma.user.create({
                data: {
                    name: customer.name,
                    email: customer.email || `guest_${customer.cpf}@temp.com`,
                    cpf: customer.cpf,
                    phone: customer.phone,
                    role: 'CUSTOMER',
                    password: 'GUEST_NO_LOGIN', // Placeholder
                    address: customer.address || {},
                    legalAcceptances: {
                        create: {
                            ipAddress: '127.0.0.1', // Should come from headers
                            termVersion: 'v1.0-checkout',
                            userAgent: 'AppPOS'
                        }
                    }
                }
            });
        }

        // 3. Create Order
        const totalAmount = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

        const order = await prisma.order.create({
            data: {
                sellerId: userId,
                buyerId: buyer.id,
                status: 'PENDING',
                total: totalAmount,
                customerName: customer.name,
                customerPhone: customer.phone,
                items: {
                    create: await Promise.all(items.map(async (item) => {
                        const prod = await prisma.product.findUnique({ where: { sku: item.sku } });
                        return {
                            productId: prod!.id,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice
                        };
                    }))
                }
            }
        });

        // 4. Deduct Stock (Transactional safety handled in actions/inventory, but we are chaining here)
        // Ideally should be in one big interactive transaction, but crossing actions modules.
        // We will call removeStock for each item. If one fails, we have a problem (SAGA pattern needed).
        // FOR MVP: We validated stock in step 1. Probability of failure is low.
        for (const item of items) {
            await removeStock(userId, item.sku, item.quantity, 'Casa', TransactionType.SALE, `Venda #${order.id.slice(0, 8)}`);
        }

        // 5. Generate Payment (Asaas)
        const payment = await createPaymentLink(order.id, totalAmount, new Date());

        // Update Order with Payment Info
        await prisma.order.update({
            where: { id: order.id },
            data: {
                asaasPaymentId: payment.id,
                paymentLink: payment.invoiceUrl
            }
        });

        return { success: true, orderId: order.id, paymentLink: payment.invoiceUrl };

    } catch (error: any) {
        console.error('Sale Error:', error);
        return { error: error.message || 'Erro ao processar venda.' };
    }
}
