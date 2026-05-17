const path = require('path');
const pino = require('pino');

const transport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
      level: 'debug'
    },
    {
      target: 'pino/file',
      options: { destination: path.join(__dirname, '../logs/app.log'), mkdir: true },
      level: 'info'
    },
  ],
});

const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'debug',
  },
  transport
);

module.exports = logger;
