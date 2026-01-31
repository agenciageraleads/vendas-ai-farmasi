'use server';

import { prisma } from '@/lib/prisma';
import { TransactionType } from '@prisma/client';

// ==========================================
// READ Actions
// ==========================================

export async function getConsultantInventory(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            inventory: {
                include: {
                    product: true
                }
            }
        }
    });

    if (!user) return { error: 'Consultor não encontrado' };

    // Agrupar itens por produto (somar quantidades de locais diferentes)
    const uniqueProducts = new Map();

    user.inventory.forEach(item => {
        if (!uniqueProducts.has(item.productId)) {
            uniqueProducts.set(item.productId, {
                productId: item.productId,
                productName: item.product.name,
                sku: item.product.sku,
                imageUrl: item.product.imageUrl,
                basePrice: Number(item.product.basePrice),
                totalQuantity: 0,
                totalValue: 0,
                locations: []
            });
        }
        
        const entry = uniqueProducts.get(item.productId);
        entry.totalQuantity += item.quantity;
        // Valor de custo total estocado (Preço Médio * Qtd)
        entry.totalValue += Number(item.costAmount); 
        
        entry.locations.push({
            id: item.id,
            location: item.location || 'Padrão',
            quantity: item.quantity,
            expiration: item.expirationDate
        });
    });

    return {
        inventory: Array.from(uniqueProducts.values()),
        consultantName: user.name
    };
}

export async function getInventorySummary(userId: string) {
    const stats = await prisma.inventoryItem.aggregate({
        where: { userId },
        _sum: {
            quantity: true,
            costAmount: true
        }
    });
    
    // Low stock count (items with < 3 units across all locations)
    // This is complex with aggregation, simplistic approach for now:
    const lowStockItems = await prisma.inventoryItem.groupBy({
        by: ['productId'],
        where: { userId },
        _sum: { quantity: true },
        having: { quantity: { _sum: { lt: 3 } } }
    });

    return {
        totalItems: stats._sum.quantity || 0,
        totalCostValue: Number(stats._sum.costAmount || 0),
        lowStockCount: lowStockItems.length
    };
}

// ==========================================
// WRITE Actions (Transactional)
// ==========================================

/**
 * Entrada de Estoque (Compra ou Ajuste Positivo)
 * Calcula Preço Médio Ponderado.
 */
export async function addStock(
    userId: string, 
    sku: string, 
    quantity: number, 
    unitCost: number, 
    location: string = 'Casa',
    note: string = 'Entrada Manual'
) {
    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { sku } });
        if (!product) throw new Error('Produto não encontrado');

        // 1. Log Transaction
        await tx.inventoryTransaction.create({
            data: {
                userId,
                productId: product.id,
                type: TransactionType.PURCHASE,
                quantity: quantity,
                unitCost: unitCost,
                totalCost: quantity * unitCost,
                note
            }
        });

        // 2. Find or Create Inventory Item for this location
        const item = await tx.inventoryItem.findFirst({
            where: { userId, productId: product.id, location }
        });

        if (item) {
            // Update with Weighted Average Cost logic
            // New Total Value = (Old Total) + (New Qty * New Cost)
            const newCostAmount = Number(item.costAmount) + (quantity * unitCost);
            
            await tx.inventoryItem.update({
                where: { id: item.id },
                data: {
                    quantity: item.quantity + quantity,
                    costAmount: newCostAmount
                }
            });
        } else {
            // Create new
            await tx.inventoryItem.create({
                data: {
                    userId,
                    productId: product.id,
                    location,
                    quantity,
                    costAmount: quantity * unitCost
                }
            });
        }
        
        return { success: true };
    });
}

/**
 * Saída de Estoque (Venda, Perda)
 * Não altera o custo unitário médio, apenas reduz o valor total proporcionalmente.
 */
export async function removeStock(
    userId: string, 
    sku: string, 
    quantity: number, 
    location: string = 'Casa',
    type: TransactionType = TransactionType.SALE,
    note: string = ''
) {
    return await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { sku } });
        if (!product) throw new Error('Produto não encontrado');

        const item = await tx.inventoryItem.findFirst({
            where: { userId, productId: product.id, location }
        });

        if (!item || item.quantity < quantity) {
            throw new Error(`Estoque insuficiente em ${location}`);
        }

        // Calculate proportional cost to remove
        // Current Avg Cost = TotalCost / TotalQty
        // Removed Cost = Avg Cost * Removed Qty
        const currentAvgCost = Number(item.costAmount) / item.quantity;
        const valueRemoved = currentAvgCost * quantity;

        // 1. Log Transaction
        await tx.inventoryTransaction.create({
            data: {
                userId,
                productId: product.id,
                type,
                quantity: -quantity, // Negative for removal logic visualization? Or keep absolute and rely on type?
                                     // Let's keep absolute in structure but logic implies removal
                unitCost: currentAvgCost,
                totalCost: valueRemoved,
                note
            }
        });

        // 2. Update Inventory
        await tx.inventoryItem.update({
            where: { id: item.id },
            data: {
                quantity: item.quantity - quantity,
                costAmount: Number(item.costAmount) - valueRemoved
            }
        });

        return { success: true };
    });
}

/**
 * Movimentação entre locais (Casa -> Carro)
 */
export async function moveStock(
    userId: string, 
    sku: string, 
    quantity: number, 
    fromLocation: string, 
    toLocation: string
) {
    return await prisma.$transaction(async (tx) => {
        // ... (Logic calls removeStock internal and addStock internal without changing logic cost, 
        // but easier to do manual updates here to preserve exact cost)
        const product = await tx.product.findUnique({ where: { sku } });
        if (!product) throw new Error('Produto não encontrado');

        // Get Source
        const sourceItem = await tx.inventoryItem.findFirst({
            where: { userId, productId: product.id, location: fromLocation }
        });

        if (!sourceItem || sourceItem.quantity < quantity) throw new Error('Estoque de origem insuficiente');

        // Calculate Cost Portion
        const costPerUnit = Number(sourceItem.costAmount) / sourceItem.quantity;
        const totalValueMoved = costPerUnit * quantity;

        // Update Source
        await tx.inventoryItem.update({
            where: { id: sourceItem.id },
            data: {
                quantity: sourceItem.quantity - quantity,
                costAmount: Number(sourceItem.costAmount) - totalValueMoved
            }
        });

        // Update/Create Destination
        const destItem = await tx.inventoryItem.findFirst({
            where: { userId, productId: product.id, location: toLocation }
        });

        if (destItem) {
            await tx.inventoryItem.update({
                where: { id: destItem.id },
                data: {
                    quantity: destItem.quantity + quantity,
                    costAmount: Number(destItem.costAmount) + totalValueMoved
                }
            });
        } else {
            await tx.inventoryItem.create({
                data: {
                    userId,
                    productId: product.id,
                    location: toLocation,
                    quantity: quantity,
                    costAmount: totalValueMoved
                }
            });
        }

        return { success: true };
    });
}
