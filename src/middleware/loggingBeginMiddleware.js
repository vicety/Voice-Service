const logger = require('../utils/logger');

module.exports = function funcLogger (req, res, next) {
  logger.debug('--------- REQUEST BEGINS ---------');
  logger.debug(`Receive ${req.method} request from ${req.ip} to ${req.path}`);
  logger.debug('Request query params are: ');
  for (const [k, v] of Object.entries(req.query)) {
    logger.debug(`${k}: ${v}`);
  }
  next();
};
