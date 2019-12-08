const { spawn } = require('child_process');
const fs = require('fs');
const logger = require('./utils/logger');

function transcodeing (filePath, outputPath) {
  logger.debug('=====FFMPEG TRANSCODING BEGINS=====');
  const spawnObj = spawn('ffmpeg', ['-i', filePath, outputPath]);
  spawnObj.stdout.on('data', (data) => {
    logger.debug(data);
  });
  spawnObj.stderr.on('data', (data) => {
    logger.error(data);
  });
  spawnObj.on('exit', (data) => {
    logger.debug(data);
    logger.debug('done');
  });
}

exports = transcodeing;

// transcodeing('../uploads/234.aac', '../output/234.wav');
