const { chromium } = require('playwright');

const seeds = [63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

async function scrapeTable(page, url) {
    await page.goto(url, { waitUntil: 'networkidle' });
    
    // Extract all numbers from all tables
    const numbers = await page.evaluate(() => {
        const cells = document.querySelectorAll('table td, table th');
        const nums = [];
        cells.forEach(cell => {
            const text = cell.innerText.trim();
            const num = parseFloat(text.replace(/,/g, ''));
            if (!isNaN(num)) {
                nums.push(num);
            }
        });
        return nums;
    });
    
    const sum = numbers.reduce((a, b) => a + b, 0);
    console.log(`Seed ${url.split('seed=')[1]}: ${numbers.length} numbers, sum = ${sum}`);
    return sum;
}

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    let totalSum = 0;
    
    for (const seed of seeds) {
        const url = `https://sanand0.github.io/tdsdata/?seed=${seed}`;
        try {
            const sum = await scrapeTable(page, url);
            totalSum += sum;
        } catch (e) {
            console.error(`Error scraping seed ${seed}: ${e.message}`);
        }
    }
    
    await browser.close();
    
    console.log(`\n=============================`);
    console.log(`TOTAL SUM = ${totalSum}`);
    console.log(`=============================`);
})();