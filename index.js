const express = require('express');
const multer = require('multer');
const logger = require('./src/utils/logger');
// const transcoding = require('./src/transcoding');
const ClientManger = require('./src/clientConnection/clientManager')
const StatusCode = require('./src/clientConnection/statusCode')
const audioRec = require('./src/audioApi/audioRec');
const audioRecStatusCode = require('./src/audioApi/audioStatus');
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
  const result = await audioRec(srcFilePath).then(({data}) => {
    let clientStatus;
    if (result.includes('家具')) clientStatus = clientManager.sendToIoT('iot', result)
    else clientStatus = clientManager.sendToPC('video', result)
    if (clientStatus === StatusCode.SUCCESS) {
      logger.debug('Successfully sent to client')
      res.send('成功')
    }
    else {
      logger.debug('Client offline')
      res.send('客户端不在线，请检查客户端网络连接')
    }
  }).catch(data => {
    res.send(audioRecStatusCode[data.code])
  });
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
