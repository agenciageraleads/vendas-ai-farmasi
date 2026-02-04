import { prisma } from '@/lib/prisma';
import { completeOnboarding } from '@/app/actions/onboarding';

async function main() {
    console.log('🧪 Testing Onboarding Flow...');

    // 1. Get a consultant user
    const user = await prisma.user.findFirst({ where: { role: 'CONSULTANT' } });
    if (!user) throw new Error('No consultant found');

    console.log(`👤 User: ${user.email} (Onboarding: ${user.onboardingCompleted})`);

    // 2. Reset onboarding for testing
    await prisma.user.update({
        where: { id: user.id },
        data: { onboardingCompleted: false },
    });
    // Clear inventory
    await prisma.inventoryItem.deleteMany({ where: { userId: user.id } });

    console.log('🔄 Reset complete. Simulating Kit Selection...');

    // 3. Select first 3 products
    const products = await prisma.product.findMany({ take: 3 });
    const stockSelection = products.map(p => ({ sku: p.sku, quantity: 2 }));

    // 4. Call Action
    const result = await completeOnboarding(user.id, stockSelection);
    console.log('📢 Action Result:', result);

    // 5. Verify
    const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
    const inventory = await prisma.inventoryItem.findMany({ where: { userId: user.id } });

    console.log(`✅ User Onboarding Status: ${updatedUser?.onboardingCompleted}`);
    console.log(`📦 Inventory Items Created: ${inventory.length}`);
    inventory.forEach(item => {
        console.log(`   - ItemID: ${item.id} | Qty: ${item.quantity} | Loc: ${item.location}`);
    });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
