var express = require('express')
var bodyparser = require('body-parser')

var {mongoose} = require('./db/mongoose')
var {todo} = require('./models/todo')
var {user} = require('./models/user')

var port = 4000
var app = express()

//middleware
app.use(bodyparser.json())

app.post('/todos', (req, resp) => {
  var newtodo = new todo(req.body)
  newtodo.save().then((doc) => {
    resp.send(doc)
  },(err) => {
    resp.status(400).send(err)
  })
})

app.get('/todos', (req, resp) => {
  todo.find().then((todos) => {
    resp.send({todos})
  },(err) =>{
    resp.status(400).send(err)
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = {app}
