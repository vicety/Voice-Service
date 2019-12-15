const logger = require('../utils/logger');
const StatusCode = require('./statusCode')

class ClientManger {
    constructor(expressServer) {
        this.io = require('socket.io')(expressServer)
        this.pcClient = null // 暂时只支持一个client
        this.iotClient = null

        this.eventRegistration()
    }   

    eventRegistration () {
        this.io.on('connection', (socket) => {
            logger.debug(`client ${socket.id} connected`)

            socket.on('register', (data) => {
                if(data === 'iot') this.iotClient = socket
                else if(data === 'pc') this.pcClient = socket;
            })

            socket.on('disconnect', (reason) => {
                this.client = null
                logger.debug(`client ${socket.id} disconnect with reason ${reason}`)
                if (reason === 'io server disconnect') {
                    // the disconnection was initiated by the server, you need to reconnect manually
                    socket.connect();
                }
            })
        })
    }

    sendToPC(event, data) {
        if(!this.client) return StatusCode.CLIENT_OFFLINE
        this.pcClient.emit(event, data)
        return StatusCode.SUCCESS
    }

    sendToIoT(event, data) {
        if(!this.client) return StatusCode.CLIENT_OFFLINE
        this.iotClient.emit(event, data)
        return StatusCode.SUCCESS
    }
} 

module.exports = ClientManger
