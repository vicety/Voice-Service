const log4js = require('log4js');

log4js.configure({ // configure to use all types in different files.
  appenders: {
    file: {
      type: 'file',
      filename: 'logs/debug.log', // specify the path where u want logs folder debug.log
      maxLogSize: 10485760,
      backups: 5,
    },
    console: {
      type: 'stdout',
    },
  },
  categories: {
    default: { appenders: ['file', 'console'], level: 'debug' },
  },
});

const logger = log4js.getLogger();

logger.level = 'debug';

module.exports = logger;
