# 🛒 Vinted & Leboncoin Monitor Bot

A high-performance, production-ready Discord bot to monitor Vinted and Leboncoin for specific items. The bot alerts users via a premium Discord UI and can automate sending messages and offers on behalf of the user.

## 🚀 Features

- **Advanced Scraping Engine**: Bypasses bot mitigations (Cloudflare, DataDome) using `puppeteer-extra-plugin-stealth` and human-like cursor behavior.
- **Distributed Queue System**: Implements randomized delays and jitter to mimic human interaction and prevent IP bans.
- **Discord Dashboard Integration**: A clean and interactive Discord UI to manage active trackers, set up alerts, and authenticate safely.
- **Automated Actions**: Send messages or place offers directly from Discord via interactive buttons using authenticated session cookies.
- **Robust Local Database**: Uses `better-sqlite3` in WAL mode for high performance and duplicate prevention.
- **Residential Proxy Rotation**: Built-in support for proxy rotation.

## 🗂 Architecture

- **Backend Framework**: Node.js (v20+)
- **Bot Interface**: Discord.js v14
- **Automation / Evasion**: Puppeteer + Stealth Plugin + Ghost Cursor
- **Database**: SQLite (better-sqlite3)
- **Deployment Strategy**: Ready for AWS EC2 via PM2

## ⚙️ Prerequisites

- Node.js version `20.x` or later.
- A Discord Bot Token (grab yours at [Discord Developer Portal](https://discord.com/developers/applications)).
- High-quality Residential Proxies (Optional but highly recommended for bypassing DataDome & Cloudflare).
- [PM2](https://pm2.keymetrics.io/) installed globally (`npm install -g pm2`) for production deployments.

## 🛠️ Installation & Setup

1. **Navigate to the project folder:**
   ```bash
   cd vinted-leboncoin-bot
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` to `.env` and configure your keys:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and insert:
   - Your `DISCORD_TOKEN`.
   - Your Proxy list inside `PROXY_LIST` (separated by commas). Example: `http://user:pass@ip:port`.

## 💻 Running the Bot

### For Development

```bash
npm run dev
```

### For Production (e.g., AWS EC2)

The project includes an `ecosystem.config.js` to manage the process via PM2.

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🎮 Discord Commands

- `/dashboard`: Opens the main interactive control panel. Here you can add new trackers with search URLs, keywords, and maximum prices.
- `/auth`: Opens a secure modal to paste your Vinted and Leboncoin session cookies. Once authenticated, the bot can send automated messages or make offers when an item drops.
- `/ping`: Simple health check and latency status.

## 🛡️ Anti-Bot Evasion Tactics Used

- **Fingerprint Masking**: Removes `navigator.webdriver`, fixes WebGL/Canvas fingerprints via Puppeteer Stealth.
- **Jitter & Delays**: Implements human-like randomized delays between scraping phases (e.g., waiting 27-34s between polls).
- **Behavioral Simulation**: Uses `ghost-cursor` to dynamically generate bezier-curve mouse movements over the page, successfully avoiding triggers on DataDome specifically.
- **Proxy Rotation**: Automatic assignment of residential IPs during browser context creation.
