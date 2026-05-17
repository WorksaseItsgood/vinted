const { createCursor } = require('ghost-cursor');
const { randomDelay } = require('../utils/helpers');
const logger = require('../utils/logger');

const scrapeVinted = async (page, url, keywords, maxPrice) => {
    const items = [];
    try {
        // Human-like interaction setup
        const cursor = createCursor(page);
        
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
        await randomDelay(1500, 3000);

        // Check for Cloudflare challenge
        const isCloudflare = await page.$('.ray_id, #challenge-running');
        if (isCloudflare) {
            logger.warn('Cloudflare challenge detected on Vinted. Attempting to bypass...');
            // Wait for challenge to resolve automatically
            await page.waitForNavigation({ timeout: 15000 }).catch(() => {});
        }

        // Simulate scrolling
        await page.evaluate(() => window.scrollBy(0, Math.floor(Math.random() * 500) + 200));
        await randomDelay(500, 1500);

        // Parse items
        const itemElements = await page.$$('.feed-grid__item');
        
        for (const element of itemElements.slice(0, 10)) {
            try {
                const id = await element.evaluate(el => el.getAttribute('data-testid')?.replace('feed-item-', '') || Math.random().toString(36).substring(7));
                const titleElement = await element.$('.new-item-box__description h2, .new-item-box__title');
                const title = titleElement ? await titleElement.evaluate(el => el.textContent.trim()) : 'Unknown Title';
                
                const priceElement = await element.$('.new-item-box__description h3, h3');
                const priceText = priceElement ? await priceElement.evaluate(el => el.textContent.trim()) : '0';
                const priceNum = parseFloat(priceText.replace(/[^0-9,.]/g, '').replace(',', '.'));

                const linkElement = await element.$('a');
                const relativeUrl = linkElement ? await linkElement.evaluate(el => el.getAttribute('href')) : null;
                const fullUrl = relativeUrl ? (relativeUrl.startsWith('http') ? relativeUrl : `https://www.vinted.fr${relativeUrl}`) : url;

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
                    id: `vinted_${id}`,
                    marketplace: 'vinted',
                    title,
                    price: priceText,
                    url: fullUrl,
                    imageUrl,
                    condition: 'N/A', 
                    sellerName: 'N/A' 
                });
            } catch (err) {
                logger.debug('Error parsing individual Vinted item:', err);
            }
        }
    } catch (error) {
        logger.error(`Vinted scraping failed for URL ${url}:`, error);
    }
    
    return items;
};

module.exports = { scrapeVinted };
