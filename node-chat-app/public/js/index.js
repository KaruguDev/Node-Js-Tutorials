(function() {
  var NYLM, claerResizeScroll, conf, getRandomInt, insertI, lol;

  conf = {
    cursorcolor: "#696c75",
    cursorwidth: "4px",
    cursorborder: "none"
  };

  lol = {
    cursorcolor: "#cdd2d6",
    cursorwidth: "4px",
    cursorborder: "none"
  };

  NYLM = ["Hi!", "Welcome", "Thank You!"];

  getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  generateMessage = function(){
    var msg = {}
    msg['from'] = 'Paul'
    msg['text'] = $('#texxt').val()

    return msg
  }

  generateLocationMessage = function(){
    //GPS LOCATION
    var msg = {
      from: 'Paul',
      latitude: '',
      longitude: ''
    }

    if(!navigator.geolocation){
      return msg
    }else{

      navigator.geolocation.getCurrentPosition(function(location){
        msg['lat'] = location.coords.latitude
        msg['longitude'] = location.coords.longitude
      });
      return msg
    }
  }

  claerResizeScroll = function() {
    $("#texxt").val("");
    $(".messages").getNiceScroll(0).resize();
    return $(".messages").getNiceScroll(0).doScrollTop(999999, 999);
  };

  socket.on('newMessage',function(msg) {
    var innerText;
    innerText = $.trim($("#texxt").val());
    if (innerText !== '' || msg.text !== undefined && msg.text !== '') {
      $(".messages").append("<li class=\"i\">\
                              <div class=\"head\">\
                                <span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + ", Today</span>\
                                <span class=\"name\"> "+msg.from+" </span>\
                              </div>\
                              <div class=\"message\">" + msg.text + "</div>\
                             </li>");
      claerResizeScroll();
    }
  });

  socket.on('newLocationMessage',function(msg) {
    var innerText;
    innerText = $.trim($("#texxt").val());
    if (innerText !== '' || msg.text !== undefined && msg.text !== '') {
      $(".messages").append("<li class=\"i\">\
                              <div class=\"head\">\
                                <span class=\"time\">" + (new Date().getHours()) + ":" + (new Date().getMinutes()) + ", Today</span>\
                                <span class=\"name\"> "+msg.from+" </span>\
                              </div>\
                              <div class=\"message\"><a target='_blank' href="+msg.url+">My Current Location</a></div>\
                             </li>");
      claerResizeScroll();
    }
  });

  $(document).ready(function() {
    var msg = {}
    msg['from'] = 'Paul'

    $(".list-friends").niceScroll(conf);
    $(".messages").niceScroll(lol);
    $("#texxt").keypress(function(e) {
      if (e.keyCode === 13) {
        socket.emit('createMessage', generateMessage(), function(){console.log('message created')})
        socket.emit('createLocationMessage', generateLocationMessage(), function(){console.log('location message created')})
        //insertI(msg);
        return false;
      }
    });
    return $(".send").click(function() {
      socket.emit('createMessage', generateMessage(), function(){console.log('message created')})
      socket.emit('createLocationMessage', generateLocationMessage(), function(){console.log('location message created')})
    })
  })
}).call(this)
