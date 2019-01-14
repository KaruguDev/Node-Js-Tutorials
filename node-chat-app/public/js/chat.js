var socket = io();

function scrollToBottom (){
  //selectors
  var messages = $('#messages')
  var newMessage = messages.children('li:last-child')
  //heights
  var clientHeight = messages.prop('clientHeight')
  var scrollTop = messages.prop('scrollTop')
  var scrollHeight = messages.prop('scrollHeight')
  var newMessageHeight = newMessage.innerHeight()
  var prevMessageHeight = newMessage.prev().innerHeight()

  if(clientHeight + scrollTop + newMessageHeight + prevMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight)
  }
}

socket.on('connect', function () {
  console.log('Connected to server');

  var params = $.deparam(window.location.search)

  socket.emit('join', params, function(err){
    if(err){
      alert(err)
      window.location.href = '/'
    }else{

    }
  })
});

socket.on('disconnect', function () {

});

socket.on('updateUserList', function(users){
  var ol = $('<ol></ol>')

  users.forEach(function(user){
    ol.append($('<li></li>').text(user))
  })

  $('#users').html(ol)
})

socket.on('existingRooms', function(rooms){
  console.log(rooms)
  if(rooms){
    $('#rooms').removeAttr('disabled')

    var ol = $('<ol></ol>')
    rooms.forEach((room) => {
      ol.append($('<li></li>').text(room))
    })
    $('rooms').html(ol)
  }else{
    $('#rooms').attr('disabled', 'disabled')
  }
})

socket.on('newMessage', function (message) {
  var template = $('#message-template').html()
  var formattedTime = moment(message.createdAt).format('h:mm A')
  var html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  })

  $('#messages').append(html);
  scrollToBottom()
});

socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm A')
  var template = $('#location-message-template').html()
  console.log(message.from, message.url, formattedTime)
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  })

  $('#messages').append(html);
  scrollToBottom()
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
