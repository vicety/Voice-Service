const logger = require('../utils/logger');

class ClientManger {
    constructor(expressServer) {
        this.io = require('socket.io')(expressServer)
        this.client = null // 暂时只支持一个client

        this.eventRegistration()
    }

    eventRegistration () {
        this.io.on('connection', (socket) => {
            this.client = socket
            logger.debug(`client ${socket.id} connected`)

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

    sendData(data) {
        if(!this.client) return CLIENT_OFFLINE
        this.client.emit('video', data)
        return SUCCESS
    }
} 

ClientManger.SUCCESS = 1
ClientManger.CLIENT_OFFLINE = 2

module.exports = ClientManger
