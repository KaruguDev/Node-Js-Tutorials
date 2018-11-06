const express = require('express')

var app = express()

app.get('/', (req, resp) => {
  resp.send('Hello There')
})

app.listen(3030, {},
  console.log('Server running on port 3030')
)

module.exports.app = app
