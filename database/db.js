const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../utils/logger');

const dbPath = path.resolve(__dirname, 'data.db');

const db = new Database(dbPath, { 
    verbose: (msg) => logger.debug(msg) 
});

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

const initDB = () => {
    try {
        db.exec(`
            CREATE TABLE IF NOT EXISTS Users (
                user_id TEXT PRIMARY KEY,
                vinted_cookie TEXT,
                leboncoin_cookie TEXT,
                is_admin INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS Trackers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                marketplace TEXT,
                url TEXT,
                keywords TEXT,
                max_price REAL,
                status TEXT DEFAULT 'active',
                last_checked INTEGER,
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            );

            CREATE TABLE IF NOT EXISTS Items (
                item_id TEXT PRIMARY KEY,
                tracker_id INTEGER,
                marketplace TEXT,
                notified_at INTEGER,
                FOREIGN KEY(tracker_id) REFERENCES Trackers(id)
            );

            CREATE TABLE IF NOT EXISTS Logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                level TEXT,
                message TEXT,
                timestamp INTEGER
            );
        `);
        logger.info('Database initialized successfully.');
    } catch (error) {
        logger.error('Failed to initialize database:', error);
        process.exit(1);
    }
};

module.exports = {
    db,
    initDB
};
