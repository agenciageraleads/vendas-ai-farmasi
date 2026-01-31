'use server';

import { prisma } from '@/lib/prisma';
import { moveStock } from '@/app/actions/inventory';
import { TransactionType } from '@prisma/client';

/**
 * Cria uma solicitação de empréstimo/produto para outro consultor.
 */
export async function createBorrowRequest(
    requesterId: string,
    ownerId: string,
    productId: string,
    quantity: number
) {
    if (!requesterId || !ownerId || !productId) return { error: 'Dados incompletos.' };
    if (quantity <= 0) return { error: 'Quantidade inválida.' };

    try {
        const request = await prisma.stockRequest.create({
            data: {
                requesterId,
                ownerId,
                productId,
                quantity,
                status: 'PENDING'
            }
        });
        return { success: true, requestId: request.id };
    } catch (error) {
        return { error: 'Erro ao criar solicitação.' };
    }
}

/**
 * Busca solicitações RECEBIDAS (que o usuário deve aprovar/rejeitar).
 */
export async function getIncomingRequests(userId: string) {
    return await prisma.stockRequest.findMany({
        where: {
            ownerId: userId,
            status: 'PENDING'
        },
        include: {
            requester: { select: { name: true, email: true } },
            product: { select: { name: true, sku: true, imageUrl: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Busca solicitações ENVIADAS (minhas).
 */
export async function getOutgoingRequests(userId: string) {
    return await prisma.stockRequest.findMany({
        where: { requesterId: userId },
        include: {
            owner: { select: { name: true } },
            product: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Aprova uma solicitação.
 * Movimenta: Estoque do Owner -> Estoque do Requester.
 * Tipo de Transação: LOAN_OUT (para Owner) e LOAN_IN (para Requester).
 */
export async function approveRequest(requestId: string, ownerId: string) {
    const request = await prisma.stockRequest.findUnique({
        where: { id: requestId },
        include: { product: true }
    });

    if (!request) return { error: 'Solicitação não encontrada.' };
    if (request.ownerId !== ownerId) return { error: 'Não autorizado.' };
    if (request.status !== 'PENDING') return { error: 'Solicitação já processada.' };

    try {
        // Transação Complexa Manual pois envolve dois usuários
        // Vamos usar a lógica de "Venda/Saída" para o Owner e "Entrada" para o Requester
        // Mas precisamos garantir atomicidade.

        await prisma.$transaction(async (tx) => {
            // 1. Verificar Estoque do Owner (Casa = Padrão por enquanto)
            const ownerItem = await tx.inventoryItem.findFirst({
                where: { userId: ownerId, productId: request.productId, location: 'Casa' }
            });

            if (!ownerItem || ownerItem.quantity < request.quantity) {
                throw new Error('Você não tem estoque suficiente na "Casa" para emprestar.');
            }

            // 2. Decrementar Owner (LOAN_OUT)
            // Custo Médio não muda na saída, apenas valor total reduz.
            const unitCost = Number(ownerItem.costAmount) / ownerItem.quantity;
            const removedValue = unitCost * request.quantity;

            await tx.inventoryItem.update({
                where: { id: ownerItem.id },
                data: {
                    quantity: ownerItem.quantity - request.quantity,
                    costAmount: Number(ownerItem.costAmount) - removedValue
                }
            });

            // Log Transaction Owner
            await tx.inventoryTransaction.create({
                data: {
                    userId: ownerId,
                    productId: request.productId,
                    type: TransactionType.LOAN_OUT,
                    quantity: -request.quantity,
                    unitCost: unitCost,
                    totalCost: removedValue,
                    partnerId: request.requesterId,
                    note: `Empréstimo aprovado #${request.id.slice(0, 6)}`
                }
            });

            // 3. Incrementar Requester (LOAN_IN em 'Casa' ou 'Empréstimos'?)
            // Vamos por na 'Casa' mas marcar a origem.
            // Para requester, o produto entra "ao custo que saiu do owner" ou "sem custo"?
            // Contabilmente, é um empréstimo. Se tiver que devolver, o valor se anula.
            // Se for compra/troca, ele assume o custo. Vamos assumir que assume o custo.

            const reqItem = await tx.inventoryItem.findFirst({
                where: { userId: request.requesterId, productId: request.productId, location: 'Casa' }
            });

            if (reqItem) {
                await tx.inventoryItem.update({
                    where: { id: reqItem.id },
                    data: {
                        quantity: reqItem.quantity + request.quantity,
                        costAmount: Number(reqItem.costAmount) + removedValue
                    }
                });
            } else {
                await tx.inventoryItem.create({
                    data: {
                        userId: request.requesterId,
                        productId: request.productId,
                        location: 'Casa',
                        quantity: request.quantity,
                        costAmount: removedValue
                    }
                });
            }

            // Log Transaction Requester
            await tx.inventoryTransaction.create({
                data: {
                    userId: request.requesterId,
                    productId: request.productId,
                    type: TransactionType.LOAN_IN,
                    quantity: request.quantity,
                    unitCost: unitCost,
                    totalCost: removedValue,
                    partnerId: ownerId,
                    note: `Recebido de empréstimo #${request.id.slice(0, 6)}`
                }
            });

            // 4. Update Status
            await tx.stockRequest.update({
                where: { id: requestId },
                data: { status: 'APPROVED' }
            });
        });

        return { success: true };

    } catch (error: any) {
        console.error(error);
        return { error: error.message || 'Falha ao aprovar.' };
    }
}

export async function rejectRequest(requestId: string, ownerId: string) {
    const request = await prisma.stockRequest.findUnique({ where: { id: requestId } });
    if (!request || request.ownerId !== ownerId) return { error: 'Erro.' };

    await prisma.stockRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
    });

    return { success: true };
}
