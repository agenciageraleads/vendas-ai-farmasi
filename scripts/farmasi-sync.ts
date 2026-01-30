import { PrismaClient } from '@prisma/client';
import { chromium } from 'playwright';

const prisma = new PrismaClient();

async function main() {
    let browser;
    try {
        console.log('🚀 Iniciando sincronização de produtos Farmasi...');

        browser = await chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // 1. Pegar todas as categorias da página principal
        console.log('🔗 Acessando página principal para mapear categorias...');
        await page.goto('https://farmasi.com.br/farmasi', { waitUntil: 'networkidle', timeout: 60000 });

        const categories = await page.evaluate(() => {
            const data = (window as any).__NEXT_DATA__;
            return data?.props?.initialData?.headerData || [];
        });

        if (categories.length === 0) {
            console.error('❌ Nenhuma categoria encontrada no headerData.');
            return;
        }

        console.log(`📂 Encontrados ${categories.length} itens no menu superior.`);

        // Filtrar categorias válidas (que tenham crmId ou URL de lista)
        const validCategories = categories.filter((cat: any) => {
            const hasCrmId = !!cat.crmId;
            const isProductList = cat.url && cat.url.includes('product-list');
            return hasCrmId || isProductList;
        });

        console.log(`🎯 Processando ${validCategories.length} categorias potenciais...`);

        for (const cat of validCategories) {
            const categoryName = cat.label || cat.name;
            const categoryId = cat.crmId || cat.pk;

            // Construir URL se estiver vazia
            let catUrl = cat.url;
            if (!catUrl || !catUrl.includes('product-list')) {
                // Normalizar nome para URL (remover acentos, espaços -> dash)
                const normalizedLabel = categoryName.toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, '-');
                catUrl = `/farmasi/product-list/${normalizedLabel}?cid=${cat.crmId}`;
            }

            const fullUrl = `https://farmasi.com.br${catUrl}`;
            console.log(`\n📦 Categoria: ${categoryName} -> ${fullUrl}`);

            try {
                await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

                const products = await page.evaluate(() => {
                    const data = (window as any).__NEXT_DATA__;
                    // Tentar múltiplos caminhos comuns no Next.js da Farmasi
                    return data?.props?.initialData?.productListData?.products ||
                        data?.props?.pageProps?.initialData?.productListData?.products || [];
                });

                if (products.length === 0) {
                    console.log(`ℹ️ Nenhum produto extraído estruturalmente para ${categoryName}.`);
                    continue;
                }

                console.log(`✨ Encontrados ${products.length} produtos.`);

                for (const p of products) {
                    const sku = p.code || p.sku;
                    if (!sku) continue;

                    const name = p.name;
                    const basePrice = p.price || 0;
                    // Farmasi geralmente dá 30% de desconto para consultores
                    const costPrice = basePrice * 0.7;
                    const imageUrl = p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `https://content.farmasi.com.br${p.imageUrl}`) : null;
                    const description = p.description || '';

                    // Upsert no banco
                    await prisma.product.upsert({
                        where: { sku: sku },
                        update: {
                            name,
                            description,
                            imageUrl,
                            basePrice,
                            costPrice,
                            updatedAt: new Date(),
                        },
                        create: {
                            sku,
                            name,
                            description,
                            imageUrl,
                            basePrice,
                            costPrice,
                        }
                    });
                }
            } catch (err: any) {
                console.error(`⚠️ Erro ao processar categoria ${categoryName}:`, err.message);
            }
        }

        console.log('\n✅ Sincronização de catálogo concluída!');

        // 2. Popular estoque de todos os usuários com novos produtos (qtd 0)
        console.log('\n🏪 Pre-cadastrando produtos nas lojas dos usuários...');
        const allUsers = await prisma.user.findMany({
            where: { role: { in: ['CONSULTANT', 'LEADER'] } }
        });
        const allProducts = await prisma.product.findMany();

        console.log(`👥 Processando ${allUsers.length} usuários e ${allProducts.length} produtos totais...`);

        for (const user of allUsers) {
            let addedCount = 0;
            for (const product of allProducts) {
                const existing = await prisma.inventoryItem.findFirst({
                    where: { userId: user.id, productId: product.id }
                });

                if (!existing) {
                    await prisma.inventoryItem.create({
                        data: {
                            userId: user.id,
                            productId: product.id,
                            quantity: 0,
                            location: 'Estoque Central',
                        }
                    });
                    addedCount++;
                }
            }
            console.log(`✅ Usuário ${user.name}: +${addedCount} novos produtos vinculados.`);
        }

        console.log('\n🏆 Sync Engine finalizado com sucesso!');

    } catch (error) {
        console.error('❌ Erro fatal durante a sincronização:', error);
    } finally {
        if (browser) await browser.close();
        await prisma.$disconnect();
    }
}

main();
