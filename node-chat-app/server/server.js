const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '..', 'public')
const config = path.join(__dirname, '..', 'config', 'config.js')

//enviroment configurations
require(config)

var app = express()
//static files
app.use(express.static(publicPath))

//http server with sockets
var httpServer = http.createServer(app)
var io = socketIO(httpServer)

io.on('connection', (socket) => {
  console.log('there is a new user connected')

  socket.on('createMessage', (msg) => {
    console.log('New Message created', msg)

    //add timestamp on message
    msg['timestamp'] = new Date().getTime()

    socket.emit('newMessage', msg)

    //broadcast
    io.emit('newMessage', msg)
  })

  socket.on('disconnect', () => {
    console.log('new user has been disconnected')
  })
})

//intiialize express
httpServer.listen(process.env.PORT, () => {
  console.log(`I am alive running on port ${process.env.PORT}`)
})
