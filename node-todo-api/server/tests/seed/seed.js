const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

const todos = [
  {
    _id: new ObjectID(),
    text: 'this is first to do'
  },
  {
    _id: new ObjectID(),
    text: 'this is second to do',
    completed: true,
    completedAt: 1237283383
  },
  {
    _id: new ObjectID(),
    text: 'i should be deleted'
  }
]

const populateTodos = (done) => {
  //delete todos
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
}

var text = 'Hey I am test'
var new_id = new ObjectID()

//Users
const userId1 = new ObjectID()
const userId2 = new ObjectID()
const users = [{
  _id: userId1,
  email: 'abc@example.com',
  password: 'abc123!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userId1, access:'auth'}, 's3cr3t').toString()
  }]
},{
  _id: userId2,
  email: 'def@example.com',
  password: 'def123!',
}]

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save()
    var user2 = new User(users[1]).save()

    return Promise.all([user1, user2])
  }).then(() => done())
}

module.exports = {todos, populateTodos, text, new_id, users, populateUsers}
