const express = require('express');
const multer = require('multer');
const logger = require('./src/utils/logger');
// const transcoding = require('./src/transcoding');
const audioRec = require('./src/audioRec');
const requestBeginLogger = require('./src/middleware/loggingBeginMiddleware');
const responseSentLogger = require('./src/middleware/loggingEndMiddleware');

const PORT = 80;
const DEFAULT_FILE_NAME = 'lastUpload.aac';
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, DEFAULT_FILE_NAME);
    },
  }),
});
const app = express();
app.use(requestBeginLogger);
app.use(responseSentLogger);

app.get('/', (request, response) => {
  console.log('get request');
  response.send('Test OK');
});

app.post('/upload', upload.any(), async (req, res, next) => {
  const srcFilePath = `uploads/${DEFAULT_FILE_NAME}`;
  // const tgtFilePath = `output/${DEFAULT_FILE_NAME}`;
  // await transcoding(srcFilePath, tgtFilePath);
  logger.debug('----- 发送语音听写请求 -----');
  const result = await audioRec(srcFilePath);
  if (result) logger.debug(result);
  else res.send('Error').end();
  res.send('upload recieved').end();
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
