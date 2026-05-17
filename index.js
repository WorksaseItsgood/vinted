require('dotenv').config();
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');
const { initDB } = require('./database/db');
const { initBot } = require('./discord/bot');

// Ensure directories exist
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const start = async () => {
    logger.info('Starting Vinted & Leboncoin Monitoring Bot...');
    
    // Initialize Database
    initDB();

    // Initialize Discord Bot
    const token = process.env.DISCORD_TOKEN;
    if (!token) {
        logger.error('DISCORD_TOKEN is missing in environment variables. Please check your .env file.');
        process.exit(1);
    }
    
    await initBot(token);
    
    // Phase 3 Scraper will be initialized here later
    const { initScraper } = require('./scraper/queue');
    await initScraper();
};

start();
