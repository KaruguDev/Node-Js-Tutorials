const path = require('path')
const http = require('http')
const hbs = require('hbs')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '..', 'public')
const partialsPath = path.join(__dirname, '../views/partials')
const config = path.join(__dirname, '..', 'config', 'config.js')

var {generateMessage, generateLocationMessage} = require('./utils/message.js')

//enviroment configurations
require(config)

var app = express()

//register partials
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')

//helpers
hbs.registerHelper('public', () => {
  return publicPath
})

//public files
app.use(express.static(publicPath))

//routes
app.get('/', (req, resp) => {
  resp.render('home.hbs', {

  })

})

app.get('/chat', (req, resp) => {
  resp.render('chatroom.hbs', {

  })

})

//http server with sockets
var httpServer = http.createServer(app)
var io = socketIO(httpServer)

//sockets
io.on('connection', (socket) => {
  console.log('there is a new user connected')

  //socket.emit('loggedIN', generateMessage('Admin','Welcome to Chat App'))

  //socket.broadcast.emit('loggedIN', generateMessage('Admin','New user joined'))
  socket.on('createMessage', (message, callback) => {
    console.log('New Message created', message)
    callback()

    //add timestamp on message
    message['timestamp'] = new Date().getTime()

    //socket.broadcast.emit('newMessage', message)

    //broadcast
    io.emit('newMessage', generateMessage(message.from, message.text))

  })

  socket.on('createLocationMessage', (message, callback) => {
    console.log('New location message created', message)
    callback()

    console.log(message)
    if (message.latitude && message.longitude){
      io.emit('newLocationMessage', generateLocationMessage(message.from, message.latitude, message.longitude))
    }
  })

  socket.on('disconnect', () => {
    console.log('new user has been disconnected')
  })
})

//intiialize express
httpServer.listen(process.env.PORT, () => {
  console.log(`I am alive running on port ${process.env.PORT}`)
})
