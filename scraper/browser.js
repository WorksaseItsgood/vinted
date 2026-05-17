const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const logger = require('../utils/logger');
const { getNextProxy } = require('./proxy');

puppeteer.use(StealthPlugin());

const createBrowser = async () => {
    const proxy = getNextProxy();
    const args = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--hide-scrollbars',
        '--mute-audio',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-extensions-with-background-pages',
        '--disable-extensions',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-renderer-backgrounding',
        '--enable-features=NetworkService,NetworkServiceInProcess'
    ];

    if (proxy) {
        args.push(`--proxy-server=${proxy.server}`);
        logger.info(`Using proxy: ${proxy.server}`);
    }

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: args,
            ignoreHTTPSErrors: true,
            defaultViewport: { width: 1920, height: 1080 }
        });
        logger.info('Puppeteer browser launched with stealth.');
        return browser;
    } catch (error) {
        logger.error('Failed to launch browser:', error);
        throw error;
    }
};

const createContext = async (browser, cookiesString) => {
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    // Authenticate with proxy if needed
    const proxy = getNextProxy(); 
    if (proxy && proxy.username && proxy.password) {
        await page.authenticate({
            username: proxy.username,
            password: proxy.password
        });
    }

    // Set cookies if provided
    if (cookiesString) {
        try {
            const cookies = JSON.parse(cookiesString);
            await page.setCookie(...cookies);
        } catch (error) {
            logger.warn('Failed to parse and set cookies:', error);
        }
    }

    // Additional stealth bypass measures
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'fr-FR', 'fr'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
    });

    return { context, page };
};

module.exports = {
    createBrowser,
    createContext
};
