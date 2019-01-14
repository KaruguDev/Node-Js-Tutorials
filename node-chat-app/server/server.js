const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation')
const {Users} = require('./utils/users')
const publicPath = path.join(__dirname, '../public');
const config = path.join(__dirname, '..', 'config', 'config.js')

require(config)

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users()

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('I am connected')

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room Name are required')
    }

    params.room = params.room.toLowerCase()
    socket.join(params.room)

    //check if user already exists
    var user = users.ifUserExists(params.name, params.room)
    if (user){
      return callback(`Username ${params.name} already exists`)
    }
    //remove existing user which has this socket id
    users.removeUser(socket.id)
    //add new user
    users.addUser(socket.id, params.name, params.room)

    //broadcast into room with the lastest users list
    io.to(params.room).emit('updateUserList', users.getUserList(params.room))

    socket.emit('newMessage', generateMessage('Admin', `${params.name} welcome to the chat app`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback()
  })

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id)
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      callback();
    }
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id)
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id)

    if(user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room))
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
    }
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is up on ${process.env.PORT}`);
});
