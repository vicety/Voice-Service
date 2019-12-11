const express = require('express');
const multer = require('multer');
const logger = require('./src/utils/logger');
// const transcoding = require('./src/transcoding');
const ClientManger = require('./src/clientConnection/clientManager')
const StatusCode = require('./src/clientConnection/statusCode')
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
// app.use(cors())
app.use(responseSentLogger);

const server = app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

const clientManager = new ClientManger(server);

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
  logger.debug(`Got result: ${result}`);
  const clientStatus = clientManager.sendData(result)
  if(clientStatus === StatusCode.SUCCESS) res.send('OK')
  else res.send('failed')
});

// websocket part
// const io = require('socket.io')(30000);
// const ioServer = require('http').Server(app)

// const io = require('socket.io')(server)
// io.on('connect', (socket) => {
//   console.log('connected')
//   socket.on('connection', () => console.log('socket connect'))
//   socket.on('disconnect', (reason) => {
//     console.log(`socket disconnect, reason: ${reason}`)
//   })
//   setInterval(() => {
//     socket.emit('server_send', `server_send at: ${(new Date()).toUTCString()}`)
//   }, 2000)
//   socket.on('client_send', (data) => { logger.debug(`rcvd from client: ${data}`) })
// })

// TODO: 改成原来的io形式
