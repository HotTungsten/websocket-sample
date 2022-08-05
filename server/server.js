const io = require('socket.io')(3001, {
    cors: {
        origin: ['http://localhost:3000']
    }
})

io.on('connection', socket => {
    console.log(socket.id)
    socket.broadcast.emit('get-current-queue')

    socket.on('video-control', playState => {
        socket.broadcast.emit('video-state', playState)
    })

    socket.on('sync-queue', queue => {
        socket.broadcast.emit('update-queue', queue)
    })
    
    socket.on('current-vid', newUrl => {
        socket.broadcast.emit('update-current-vid', newUrl)
    })
})