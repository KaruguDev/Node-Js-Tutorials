var generateMessage = (from, text) => {
  return {
    from,
    text,
    timestamp: new Date().getTime()
  }
}

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from,
    url: `https://google.com/maps?q=${latitude},${longitude}`,
    timestamp: new Date().getTime()
  }
}

module.exports = {generateMessage, generateLocationMessage}
