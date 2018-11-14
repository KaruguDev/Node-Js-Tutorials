const express = require('express')

var app = express()

app.get('/', (req, resp) => {
  resp.send({
    body: 'Hello There'
  })
})

app.get('/users', (req, resp) => {
  resp.send([
      {name: 'Paul', age: 39},
      {name: 'Cole', age: 25},
      {name: 'Felix', age: 34},
      {name: 'Maureen', age: 19},
      {name: 'Sanne', age: 29},
  ])
})

app.listen(3030, {},
  console.log('Server running on port 3030')
)

module.exports.app = app
