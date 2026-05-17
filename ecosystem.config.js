module.exports = {
  apps: [{
    name: "vinted-leboncoin-bot",
    script: "./index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      LOG_LEVEL: "info"
    },
    env_development: {
      NODE_ENV: "development",
      LOG_LEVEL: "debug"
    }
  }]
};
