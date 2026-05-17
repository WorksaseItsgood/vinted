const { db } = require('../database/db');
const { createBrowser, createContext } = require('./browser');
const { scrapeVinted } = require('./vinted');
const { scrapeLeboncoin } = require('./leboncoin');
const { sleep, randomDelay } = require('../utils/helpers');
const logger = require('../utils/logger');
const { client } = require('../discord/bot');
const { buildAlertEmbed } = require('../discord/ui/embeds');
const { buildAlertButtons } = require('../discord/ui/components');

let browserInstance = null;
let isPolling = false;

const initScraper = async () => {
    logger.info('Initializing Scraper Queue...');
    try {
        browserInstance = await createBrowser();
        startPolling();
    } catch (error) {
        logger.error('Failed to initialize scraper:', error);
    }
};

const startPolling = async () => {
    if (isPolling) return;
    isPolling = true;

    while (true) {
        try {
            const trackers = db.prepare("SELECT * FROM Trackers WHERE status = 'active'").all();

            for (const tracker of trackers) {
                await processTracker(tracker);
                // Jitter between requests to avoid pattern detection
                await randomDelay(2000, 5000); 
            }
        } catch (error) {
            logger.error('Error in polling loop:', error);
        }

        // Base polling delay with jitter (e.g., 25-35 seconds)
        await randomDelay(25000, 35000);
    }
};

const processTracker = async (tracker) => {
    logger.debug(`Processing tracker ID ${tracker.id} for ${tracker.marketplace}`);
    let items = [];
    
    // In a real scenario, we might want persistent contexts per tracker/user
    const { context, page } = await createContext(browserInstance);

    try {
        if (tracker.marketplace === 'vinted') {
            items = await scrapeVinted(page, tracker.url, tracker.keywords, tracker.max_price);
        } else if (tracker.marketplace === 'leboncoin') {
            items = await scrapeLeboncoin(page, tracker.url, tracker.keywords, tracker.max_price);
        }

        // Update last checked
        db.prepare("UPDATE Trackers SET last_checked = ? WHERE id = ?").run(Math.floor(Date.now() / 1000), tracker.id);

        for (const item of items) {
            const exists = db.prepare("SELECT item_id FROM Items WHERE item_id = ?").get(item.id);
            if (!exists) {
                // New item found!
                db.prepare("INSERT INTO Items (item_id, tracker_id, marketplace, notified_at) VALUES (?, ?, ?, ?)").run(
                    item.id, tracker.id, tracker.marketplace, Math.floor(Date.now() / 1000)
                );
                
                await sendAlert(tracker.user_id, item);
            }
        }
    } catch (error) {
        logger.error(`Error scraping tracker ${tracker.id}:`, error);
    } finally {
        await page.close();
        await context.close();
    }
};

const sendAlert = async (userId, item) => {
    try {
        const user = await client.users.fetch(userId);
        if (user) {
            const embed = buildAlertEmbed(item);
            const components = buildAlertButtons(item.url);

            await user.send({ embeds: [embed], components: [components] });
            logger.info(`Alert sent to user ${userId} for item ${item.id}`);
        }
    } catch (error) {
        logger.error(`Failed to send alert to user ${userId}:`, error);
    }
};

module.exports = {
    initScraper
};
