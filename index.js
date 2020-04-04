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
const axios = require('axios')
const bodyParser = require('body-parser')

const PORT = 80;
const DEFAULT_FILE_NAME = 'lastUpload.aac';
const PC_ORDER = "PC"
const IOT_ORDER = "IOT"

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

// TODO，在客户端添加图标用于表示两个客户端的在线状况（这样快应用也得加SocketIO，也不知道支不支持
app.post('/upload', upload.any(), async (req, res, next) => {
  const srcFilePath = `uploads/${DEFAULT_FILE_NAME}`;
  logger.debug('----- 发送语音听写请求 -----');
  await audioRec(srcFilePath).then(async ({ data }) => {
    logger.debug(`Got Data: ${data}`)
    let clientStatus;
    let result = await axios.post('http://localhost:21112/predict_order', {
      "word": data
    })
    result = result.data.data;
    logger.debug(`${data} is judge to ${result}`)
    if (result == IOT_ORDER) clientStatus = clientManager.sendToIoT('iot', data)
    else clientStatus = clientManager.sendToPC('video', data)
    if (clientStatus === StatusCode.SUCCESS) {
      logger.debug('Successfully sent to client')
      res.send('成功')
    }
    else if (clientStatus == StatusCode.PC_CLIENT_OFFLINE) res.send('电脑客户端不在线，请检查客户端网络连接')  // 用户可能想对IOT说，但是返回电脑？  // 如果只是说不在线，用户没法知道是谁不在线
    else res.send('物联网客户端不在线，请检查客户端网络连接')
  }).catch(data => {
    res.send(audioRecStatusCode[data.code])
  });
});

app.post('/most_similar', bodyParser.json(), async function (req, res, next) {
  // logger.debug(req.body.pattern[0])
  
  axios.post('http://localhost:21112/most_similar', {
    "word": req.body.word,
    "pattern": req.body.pattern
  }).then(result => {
    logger.debug(result.data)
    res.send(result.data)
  })
  
})
