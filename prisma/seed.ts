import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // 1. Create a Leader
    const leader = await prisma.user.upsert({
        where: { email: 'lider@farmasi.com' },
        update: {},
        create: {
            email: 'lider@farmasi.com',
            name: 'Líder Supremo',
            password: 'password123', // In real app, hash this
            role: Role.LEADER,
        },
    })

    // 2. Create a Consultant (Team Member)
    const consultant = await prisma.user.upsert({
        where: { email: 'consultora@farmasi.com' },
        update: {},
        create: {
            email: 'consultora@farmasi.com',
            name: 'Maria Consultora',
            password: 'password123',
            role: Role.CONSULTANT,
            leaderId: leader.id,
        },
    })

    // 3. Create Products (Simulating import from catalog)
    const products = [
        {
            name: 'Batom Matte Merlot',
            sku: 'BAT-001',
            basePrice: 49.90,
            costPrice: 20.00, // Approx 30% + promo
            description: 'Batom líquido matte de longa duração cor Merlot.',
        },
        {
            name: 'Base VFX Pro Camera Ready',
            sku: 'BAS-001',
            basePrice: 89.90,
            costPrice: 45.00,
            description: 'Base de alta cobertura com efeito filtro de foto.',
        },
        {
            name: 'Máscara Double Lash Extend',
            sku: 'MAS-001',
            basePrice: 59.90,
            costPrice: 25.00,
            description: 'Máscara para cílios efeito 2 em 1.',
        },
        {
            name: 'Dr. C. Tuna Tea Tree Cream',
            sku: 'CRE-001',
            basePrice: 39.90,
            costPrice: 15.00,
            description: 'Creme hidratante com óleo de melaleuca.',
        }
    ]

    for (const p of products) {
        await prisma.product.upsert({
            where: { sku: p.sku },
            update: {},
            create: p,
        })
    }

    // 4. Create Inventory for Consultant
    // Maria has 5 Batons (2 in Bag, 3 at Home)
    const batom = await prisma.product.findUnique({ where: { sku: 'BAT-001' } })
    if (batom) {
        await prisma.inventoryItem.create({
            data: {
                userId: consultant.id,
                productId: batom.id,
                quantity: 2,
                location: 'Bolsa de Vendas',
                batchNumber: 'Lote123',
            }
        })
        await prisma.inventoryItem.create({
            data: {
                userId: consultant.id,
                productId: batom.id,
                quantity: 3,
                location: 'Casa - Estoque',
                batchNumber: 'Lote124',
            }
        })
    }

    console.log({ leader, consultant })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
