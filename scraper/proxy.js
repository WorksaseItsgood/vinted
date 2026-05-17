const logger = require('../utils/logger');

// Proxies should be provided in the .env file like PROXY_LIST="http://user:pass@ip:port,http://user:pass@ip2:port"
let proxyList = [];
let currentIndex = 0;

const initProxies = () => {
    const proxiesEnv = process.env.PROXY_LIST;
    if (proxiesEnv) {
        proxyList = proxiesEnv.split(',').map(p => {
            try {
                const url = new URL(p);
                return {
                    server: `${url.protocol}//${url.hostname}:${url.port}`,
                    username: url.username || null,
                    password: url.password || null
                };
            } catch (e) {
                logger.error(`Invalid proxy format: ${p}`);
                return null;
            }
        }).filter(p => p !== null);
        logger.info(`Loaded ${proxyList.length} proxies.`);
    } else {
        logger.warn('No proxies found in .env (PROXY_LIST). Scraping might be blocked.');
    }
};

const getNextProxy = () => {
    if (proxyList.length === 0) return null;
    const proxy = proxyList[currentIndex];
    currentIndex = (currentIndex + 1) % proxyList.length;
    return proxy;
};

// Initialize on load
initProxies();

module.exports = {
    getNextProxy
};
