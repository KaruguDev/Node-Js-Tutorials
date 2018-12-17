var socket = io()

socket.on('connect', function(){
  console.log('connected to server')

  socket.emit('createMessage', {
    from: 'Paul',
    message: 'How are you doing?'
  })
})

socket.on('loggedIN', function(msg){
  console.log(msg)
})

socket.on('disconnect', function(){
  console.log('disconnected from server')
})

socket.on('newMessage', function(msg){
  console.log('You have new message', msg)
})
