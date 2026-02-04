import { PrismaClient } from '@prisma/client';
import { chromium, Page } from 'playwright';

const prisma = new PrismaClient();

async function handleCaptcha(page: Page) {
    try {
        // Tentativa 1: Botão padrão do Amazon WAF ou Cloudflare
        const captchaFrame = page.frames().find(f => f.url().includes('challenge') || f.url().includes('captcha'));
        if (captchaFrame) {
            console.log('🛡️ Captcha detectado! Tentando clicar no botão de iniciar...');
            await captchaFrame.click('button', { timeout: 2000 }).catch(() => { });
        }

        // Tentativa 2: Botão na página principal
        const btn = await page.$('button:has-text("Iniciar"), button:has-text("challenge")');
        if (btn) await btn.click();

        // Espera humana se necessário
        console.log('⏳ Aguardando possível verificação humana (10s)...');
        await page.waitForTimeout(5000);
    } catch (e) {
        // Ignorar erros de captcha, seguir o baile
    }
}

async function main() {
    let browser;
    try {
        console.log('🚀 Iniciando sincronização (Modo Visual - Acompanhe a janela do navegador)...');

        browser = await chromium.launch({
            headless: false, // IMPORTANTE: Usuário quer ver/interagir
            args: ['--start-maximized']
        });

        const context = await browser.newContext({
            viewport: null,
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        });

        const page = await context.newPage();

        // 1. Acessar página principal e passar captcha
        console.log('🔗 Acessando página principal...');
        await page.goto('https://farmasi.com.br/farmasi', { waitUntil: 'domcontentloaded', timeout: 60000 });
        await handleCaptcha(page);

        // 2. Extrair menu de categorias do DOM
        console.log('📂 Mapeando categorias...');
        // Seletores baseados em observação comum de menus Mega Nav
        const categoryLinks = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a[href*="/product-list/"]'));
            return links.map(link => ({
                name: link.textContent?.trim() || '',
                url: link.getAttribute('href') || ''
            })).filter(l => l.name && l.url);
        });

        // Dedup categorias
        const uniqueCategories = Array.from(new Map(categoryLinks.map(item => [item.url, item])).values());
        console.log(`🎯 Encontradas ${uniqueCategories.length} categorias de produtos.`);

        for (const cat of uniqueCategories) {
            const fullUrl = `https://farmasi.com.br${cat.url}`;
            console.log(`\n📦 Processando: ${cat.name}`);

            try {
                await page.goto(fullUrl, { waitUntil: 'domcontentloaded' });
                await handleCaptcha(page);

                // Scroll suave para carregar lazy loading
                await page.evaluate(async () => {
                    for (let i = 0; i < 5; i++) {
                        window.scrollBy(0, 500);
                        await new Promise(r => setTimeout(r, 500));
                    }
                });

                // Raspagem via DOM (Seletores identificados pelo Subagent)
                const products = await page.evaluate(() => {
                    const cards = Array.from(document.querySelectorAll('div[class*="styles_card__"]'));

                    return cards.map(card => {
                        const texts = Array.from(card.querySelectorAll('*'))
                            .filter(el => el.children.length === 0)
                            .map(el => el.textContent?.trim())
                            .filter((t): t is string => !!t && t.length > 0);

                        const imgEl = card.querySelector('img');
                        const imgUrl = imgEl ? imgEl.src : null;

                        // Tentar inferir campos baseado no conteúdo
                        const priceText = texts.find(t => t.includes('R$'));
                        const price = priceText
                            ? parseFloat(priceText.replace('R$', '').replace('.', '').replace(',', '.').trim())
                            : 0;

                        // SKU geralmente é numérico e tem ~7 digitos
                        // Ou é um código curto sem espaços
                        const sku = texts.find(t => /^\d{7,8}$/.test(t) || (t.length > 4 && t.length < 10 && !t.includes(' ') && !t.includes('R$'))) || 'Unknown';

                        // Nome é geralmente o primeiro texto que não é tag "NOVO" ou percentual
                        const name = texts.find(t => t !== 'NOVO' && !t.includes('%') && !t.includes('R$') && t !== sku) || texts[0];

                        return {
                            name: name || 'Produto Sem Nome',
                            sku,
                            basePrice: price,
                            imageUrl: imgUrl,
                            description: ''
                        };
                    }).filter(p => p.basePrice > 0 && p.sku !== 'Unknown');
                });

                console.log(`✨ Extraídos ${products.length} produtos da página.`);

                for (const p of products) {
                    await prisma.product.upsert({
                        where: { sku: p.sku },
                        update: {
                            name: p.name,
                            imageUrl: p.imageUrl,
                            basePrice: p.basePrice,
                            costPrice: p.basePrice * 0.7, // 30% margem padrão
                            updatedAt: new Date(),
                        },
                        create: {
                            sku: p.sku,
                            name: p.name,
                            description: p.description,
                            imageUrl: p.imageUrl,
                            basePrice: p.basePrice,
                            costPrice: p.basePrice * 0.7,
                        }
                    });
                }

            } catch (err: any) {
                console.error(`⚠️ Erro na categoria ${cat.name}: ${err.message}`);
            }
        }

        console.log('\n✅ Sincronização de catálogo concluída!');

    } catch (error) {
        console.error('❌ Erro fatal:', error);
    } finally {
        if (browser) await browser.close();
        await prisma.$disconnect();
    }
}

main();
