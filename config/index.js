require('dotenv').config();
const path = require('path');

function loadDbConfig() {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  return require('./config.json')[ENV]; // eslint-disable-line
}

const ENV = process.env.NODE_ENV || 'development';
const dbConfig = loadDbConfig();

const config = {
  [ENV]: true,
  env: ENV,
  db: dbConfig,

  port: process.env.port || 3000,
  host: process.env.host || '0.0.0.0',

  logging: {
    appenders: {
      console: { type: 'console' },
      file: { type: 'file', filename: path.resolve(__dirname, '../logs/log.log') },
    },
    categories: { default: { appenders: ['console', 'file'], level: 'debug' } },
  },
};

module.exports = config;
