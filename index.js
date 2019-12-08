const express = require('express');
const multer = require('multer');
const transcoding = require('./src/transcoding');
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
  await transcoding(`uploads/${DEFAULT_FILE_NAME}`, `output/${DEFAULT_FILE_NAME}`);
  res.send('upload recieved');
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
