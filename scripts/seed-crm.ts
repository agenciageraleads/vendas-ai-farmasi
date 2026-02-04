import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding CRM Historical Data...');

    const user = await prisma.user.findFirst({ where: { role: 'CONSULTANT' } });
    if (!user) throw new Error('Consultant Not Found');

    const products = await prisma.product.findMany({ take: 5 });
    if (products.length === 0) throw new Error('No products found');

    // 1. Create a customer
    const customer = await prisma.user.upsert({
        where: { email: 'cliente.vip@gmail.com' },
        update: {},
        create: {
            email: 'cliente.vip@gmail.com',
            name: 'Ana Maria CRM',
            password: 'hash',
            role: 'CUSTOMER',
            phone: '11999998888',
        }
    });

    // 2. Create OLD orders (to trigger recall)
    const dates = [30, 45, 60]; // Days ago

    for (const daysAgo of dates) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        const order = await prisma.order.create({
            data: {
                sellerId: user.id,
                buyerId: customer.id,
                status: OrderStatus.PAID,
                total: 100,
                customerName: customer.name,
                customerPhone: customer.phone,
                createdAt: date,
                updatedAt: date,
                items: {
                    create: {
                        productId: products[0].id, // Same product repeatedly
                        quantity: 1,
                        unitPrice: Number(products[0].basePrice)
                    }
                }
            }
        });
        console.log(`📜 Created Order from ${daysAgo} days ago: ${order.id}`);
    }

    // 3. Update Product Duration to match
    await prisma.product.update({
        where: { id: products[0].id },
        data: { usageDuration: 30 } // Should trigger alert for the 30-day-old order immediately
    });

    console.log('✅ CRM Seed Complete! Ana Maria should appear in alerts.');
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
