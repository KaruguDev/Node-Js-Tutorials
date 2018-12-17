var generateMessage = (from, text) => {
  return {
    from,
    text,
    timestamp: new Date().getTime()
  }
}

module.exports = {generateMessage}
