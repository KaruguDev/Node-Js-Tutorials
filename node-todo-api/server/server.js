var express = require('express')
var bodyparser = require('body-parser')
var {ObjectID} = require('mongodb')

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

app.get('/todos/:id', (req, resp) => {
  var id = req.params.id
  if(!ObjectID.isValid(id)){
    return resp.status(404).send()
  }

  todo.findById(id).then((todo) => {
    if(!todo){
      return resp.status(404).send({"error":`ID:${id} not found`})
    }
    return resp.send({todo})
  }).catch((e) => {
    return resp.status(400).send()
  })
})

app.delete('/todos/:id', (req, resp) => {
  var id = req.params.id

  if(!ObjectID.isValid(id)){
    return resp.status(404).send({error: `ID:${id} is invalid`})
  }

  todo.findByIdAndDelete(id).then((todo) => {
    if(!todo){
      return resp.status(404).send({error: `todo with ID:${id} not found`})
    }
    return resp.send({todo})
  }).catch((e) => {
    return resp.status(400).send()
  })

})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = {app}
