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
app.post('/todos', authenticate, (req, resp) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  })
  todo.save().then((doc) => {
    resp.send(doc)
  },(err) => {
    resp.status(400).send(err)
  })
})

app.get('/todos', authenticate, (req, resp) => {
  Todo.find({_creator: req.user._id}).then((todos) => {
    resp.send({todos})
  },(err) =>{
    resp.status(400).send(err)
  })
})

app.get('/todos/:id', authenticate, (req, resp) => {
  var _id = req.params.id
  var _creator = req.user._id

  if(!ObjectID.isValid(_id)){
    return resp.status(404).send()
  }

  Todo.findOne({_id, _creator}).then((todo) => {
    if(!todo){
      return resp.status(404).send({"error":`ID:${_id} not found`})
    }
    return resp.send({todo})
  }).catch((e) => {
    console.log(e)
    return resp.status(400).send(e)
  })
})

app.delete('/todos/:id', authenticate, (req, resp) => {
  var _id = req.params.id
  var _creator = req.user._id

  if(!ObjectID.isValid(_id)){
    return resp.status(404).send({error: `ID:${_id} is invalid`})
  }

  Todo.findOneAndDelete({_id, _creator}).then((todo) => {
    if(!todo){
      return resp.status(404).send({error: `todo with ID:${_id} not found`})
    }

    return resp.send({todo})
  }).catch((e) => {
    return resp.status(400).send()
  })

})

app.patch('/todos/:id', authenticate, (req, resp) => {
  var _id = req.params.id
  var _creator = req.user._id

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
  Todo.findOneAndUpdate({_id, _creator}, {$set:body}, {new:true}).then((todo) => {
    if(!todo){
      return resp.status(404).send()
    }
    resp.send({todo})
  }).catch((e) => {
    console.log(e)
    resp.status(400).send(e)
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

app.delete('/users/logout', authenticate, (req,resp) => {
  req.user.removeToken(req.token).then(() => {
    resp.send()
  }, () => {
    resp.status(400).send()
  })
})

//Express running
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = {app}
