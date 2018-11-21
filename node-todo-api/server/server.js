require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyparser = require('body-parser')
const {ObjectID} = require('mongodb')

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

app.patch('/todos/:id', (req, resp) => {
  var _id = req.params.id

  //the variable a user can manipulate
  var body = _.pick(req.body, ['text', 'completed'])

  //check validity of id
  if(!ObjectID.isValid(_id)){
    return resp.status(404).send()
  }

  //completion boolean status check
  if (_.isBoolean(body.completed) && body.completed ){
    body.completedAt = new Date().getTime()
  }else{
    body.completed = false
    body.completedAt = null
  }

  //Update todo doc
  todo.findByIdAndUpdate(_id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return resp.status(404).send()
    }
    resp.send({todo})
  }).catch((e) => {
    resp.status(400).send()
  })

})

//Express running
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = {app}
