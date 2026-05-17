const { createCursor } = require('ghost-cursor');
const { randomDelay } = require('../utils/helpers');
const logger = require('../utils/logger');

const scrapeLeboncoin = async (page, url, keywords, maxPrice) => {
    const items = [];
    try {
        const cursor = createCursor(page);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await randomDelay(2000, 4000);

        // Check for DataDome challenge
        const isDataDome = await page.$('iframe[src*="datadome.co"]');
        if (isDataDome) {
            logger.warn('DataDome challenge detected on Leboncoin. Proxy rotation might be needed.');
            await page.waitForTimeout(5000);
        }

        // Simulate reading
        await cursor.move({ x: Math.random() * 500, y: Math.random() * 500 });
        await page.evaluate(() => window.scrollBy(0, 300));
        await randomDelay(1000, 2000);

        const itemElements = await page.$$('[data-qa-id="aditem_container"]');
        
        for (const element of itemElements.slice(0, 10)) {
            try {
                const linkElement = await element.$('a');
                if (!linkElement) continue;

                const relativeUrl = await linkElement.evaluate(el => el.getAttribute('href'));
                const fullUrl = `https://www.leboncoin.fr${relativeUrl}`;
                const idMatch = relativeUrl.match(/\/(\d+)\.htm/);
                const id = idMatch ? idMatch[1] : Math.random().toString(36).substring(7);

                const titleElement = await element.$('[data-qa-id="aditem_title"]');
                const title = titleElement ? await titleElement.evaluate(el => el.textContent.trim()) : 'Unknown Title';

                const priceElement = await element.$('[data-qa-id="aditem_price"]');
                const priceText = priceElement ? await priceElement.evaluate(el => el.textContent.trim()) : '0 €';
                const priceNum = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));

                const imgElement = await element.$('img');
                const imageUrl = imgElement ? await imgElement.evaluate(el => el.getAttribute('src')) : null;

                // Filters
                if (maxPrice && priceNum > parseFloat(maxPrice)) continue;
                
                if (keywords) {
                    const kwList = keywords.split(',').map(k => k.trim().toLowerCase());
                    const titleLower = title.toLowerCase();
                    const matchesKw = kwList.some(kw => titleLower.includes(kw));
                    if (!matchesKw) continue;
                }

                items.push({
                    id: `lbc_${id}`,
                    marketplace: 'leboncoin',
                    title,
                    price: priceText,
                    url: fullUrl,
                    imageUrl,
                    condition: 'N/A',
                    sellerName: 'N/A'
                });
            } catch (err) {
                logger.debug('Error parsing individual LBC item:', err);
            }
        }
    } catch (error) {
        logger.error(`Leboncoin scraping failed for URL ${url}:`, error);
    }
    
    return items;
};

module.exports = { scrapeLeboncoin };
