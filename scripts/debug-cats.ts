import { chromium } from 'playwright';

async function main() {
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://farmasi.com.br/farmasi', { waitUntil: 'networkidle' });

        const categories = await page.evaluate(() => {
            const data = (window as any).__NEXT_DATA__;
            return data?.props?.initialData?.headerData || [];
        });

        const maquiagem = categories.find((c: any) => c.label === 'Maquiagem');
        console.log('Maquiagem Category:', JSON.stringify(maquiagem, null, 2));

    } catch (error) {
        console.error(error);
    } finally {
        if (browser) await browser.close();
    }
}

main();
