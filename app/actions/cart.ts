'use server';

import { prisma } from '@/lib/prisma';

/**
 * Busca ou cria carrinho ativo do usuário
 * @param userId - ID do usuário
 * @returns Carrinho ativo com itens e produtos
 */
export async function getActiveCart(userId: string) {
    try {
        // Buscar carrinho mais recente do usuário
        let cart = await prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                sku: true,
                                imageUrl: true,
                                basePrice: true
                            }
                        }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Se não existir, criar novo carrinho
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    sku: true,
                                    imageUrl: true,
                                    basePrice: true
                                }
                            }
                        }
                    }
                }
            });
        }

        return cart;
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        throw new Error('Erro ao carregar carrinho');
    }
}

/**
 * Adiciona item ao carrinho ou incrementa quantidade se já existir
 * @param userId - ID do usuário
 * @param productId - ID do produto
 * @param quantity - Quantidade a adicionar
 * @param unitPrice - Preço unitário
 */
export async function addToCart(
    userId: string,
    productId: string,
    quantity: number,
    unitPrice: number
) {
    try {
        const cart = await getActiveCart(userId);

        // Verificar se item já existe no carrinho
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (existingItem) {
            // Atualizar quantidade do item existente
            return await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
        } else {
            // Criar novo item no carrinho
            return await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    unitPrice
                }
            });
        }
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        throw new Error('Erro ao adicionar produto');
    }
}

/**
 * Atualiza quantidade e/ou preço de um item do carrinho
 * @param cartItemId - ID do item do carrinho
 * @param quantity - Nova quantidade
 * @param unitPrice - Novo preço unitário
 */
export async function updateCartItem(
    cartItemId: string,
    quantity: number,
    unitPrice: number
) {
    try {
        return await prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity, unitPrice }
        });
    } catch (error) {
        console.error('Erro ao atualizar item do carrinho:', error);
        throw new Error('Erro ao atualizar item');
    }
}

/**
 * Remove item do carrinho
 * @param cartItemId - ID do item do carrinho
 */
export async function removeFromCart(cartItemId: string) {
    try {
        return await prisma.cartItem.delete({
            where: { id: cartItemId }
        });
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
        throw new Error('Erro ao remover item');
    }
}

/**
 * Limpa todos os itens e deleta o carrinho (após finalização de venda)
 * @param cartId - ID do carrinho
 */
export async function clearCart(cartId: string) {
    try {
        // Deletar todos os itens (cascade já faz isso, mas explicitando)
        await prisma.cartItem.deleteMany({
            where: { cartId }
        });

        // Deletar o carrinho
        return await prisma.cart.delete({
            where: { id: cartId }
        });
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        throw new Error('Erro ao finalizar carrinho');
    }
}

/**
 * Salva dados do cliente no carrinho (pré-preenchimento)
 * @param cartId - ID do carrinho
 * @param customerData - Dados do cliente
 */
export async function saveCartCustomer(
    cartId: string,
    customerData: {
        name?: string;
        cpf?: string;
        phone?: string;
    }
) {
    try {
        return await prisma.cart.update({
            where: { id: cartId },
            data: {
                customerName: customerData.name,
                customerCpf: customerData.cpf,
                customerPhone: customerData.phone
            }
        });
    } catch (error) {
        console.error('Erro ao salvar dados do cliente:', error);
        throw new Error('Erro ao salvar dados do cliente');
    }
}
