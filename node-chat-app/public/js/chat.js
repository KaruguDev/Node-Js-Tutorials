var socket = io()

socket.on('connect', function(){
  console.log('connected to server')
})


socket.on('disconnect', function(){
  console.log('disconnected from server')
})

socket.on('newMessage', function(msg){
  console.log('You have new message', msg)
})

socket.on('newLocationMessage', function(msg){
  console.log('You have new location message', msg)
})
