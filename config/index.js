require('dotenv').config();
const path = require('path');
const db = require('./config.json');

const ENV = process.env.NODE_ENV || 'development';

const config = {
  [ENV]: true,
  env: ENV,
  db,

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
