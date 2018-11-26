require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyparser = require('body-parser')
const {ObjectID} = require('mongodb')
const bcrypt = require('bcryptjs')

var {mongoose} = require('./db/mongoose')
var {Todo} = require('./models/todo')
var {User} = require('./models/user')
var {authenticate} =require('./middleware/authenticate')

var port = 4000
var app = express()

//middleware
app.use(bodyparser.json())

//TODOS routes
app.post('/todos', (req, resp) => {
  var todo = new Todo(req.body)
  todo.save().then((doc) => {
    resp.send(doc)
  },(err) => {
    resp.status(400).send(err)
  })
})

app.get('/todos', (req, resp) => {
  Todo.find().then((todos) => {
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

  Todo.findById(id).then((todo) => {
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

  Todo.findByIdAndDelete(id).then((todo) => {
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
  Todo.findByIdAndUpdate(_id, {$set: body}, {new: true}).then((todo) => {
    if(!todo){
      return resp.status(404).send()
    }
    resp.send({todo})
  }).catch((e) => {
    resp.status(400).send()
  })

})

//USERS routes
app.post('/users', (req, resp) => {
  var body = _.pick(req.body, ['email', 'password'])

  var user = new User(body)
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    resp.header('x-auth', token).send(user)
  }).catch((e) => {
    return resp.status(400).send(e)
  })
})

app.post('/users/login', (req, resp) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      resp.header('x-auth', token).send(user)
    })
  }).catch((e) => {
    resp.status(400).send()
  })

})

app.get('/users/me', authenticate, (req, resp) => {
  resp.send(req.user)
})

//Express running
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = {app}
