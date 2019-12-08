const logger = require('../utils/logger');

module.exports = function funcLogger (req, res, next) {
  function afterResponse () {
    logger.debug('Response sent');
  }
  res.on('finish', afterResponse);
  next();
};
