const { chromium } = require('playwright');

const seeds = [63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

async function scrapeTable(page, seed) {
    const url = `https://sanand0.github.io/tdsdata/?seed=${seed}`;
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for tables to load
    await page.waitForSelector('table', { timeout: 10000 }).catch(() => {});

    const numbers = await page.evaluate(() => {
        const cells = document.querySelectorAll('table td, table th');
        const nums = [];
        cells.forEach(cell => {
            const text = cell.innerText.trim().replace(/,/g, '');
            const num = parseFloat(text);
            if (!isNaN(num) && text !== '') {
                nums.push(num);
            }
        });
        return nums;
    });

    const sum = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${seed}: found ${numbers.length} numbers, sum = ${sum}`);
    return sum;
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    let totalSum = 0;

    for (const seed of seeds) {
        try {
            const sum = await scrapeTable(page, seed);
            totalSum += sum;
        } catch (e) {
            console.error(`Error on seed ${seed}: ${e.message}`);
        }
    }

    await browser.close();

    console.log(`Total Sum: ${totalSum}`);
})();