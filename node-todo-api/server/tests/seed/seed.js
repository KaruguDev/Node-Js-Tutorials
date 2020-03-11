const jwt = require('jsonwebtoken')
const {ObjectID} = require('mongodb')
const {Todo} = require('./../../models/todo')
const {User} = require('./../../models/user')

let uid1 = new ObjectID()
let uid2 = new ObjectID()
let uid3 = new ObjectID()

//Users
const users = [{
  _id: uid1,
  email: 'abc@example.com',
  password: 'abc123!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:uid1, access:'auth'}, process.env.JWT_SECRET).toString()
  }]
},{
  _id: uid2,
  email: 'def@example.com',
  password: 'def123!'
}, {
  _id: uid3,
  email: 'paul@example.com',
  password: 'paul123!',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:uid3, access:'auth'}, process.env.JWT_SECRET).toString()
  }]
}]

const populateUsers = (done) => {
  User.deleteMany({}).then(() => {
    let user1 = new User(users[0]).save()
    let user2 = new User(users[1]).save()
    let user3 = new User(users[2]).save()

    return Promise.all([user1, user2, user3])
  }).then(() => done())
}

//Todos
const todos = [
  {
    _id: new ObjectID() ,
    text: 'this is first to do',
    _creator: uid1
  },
  {
    _id: new ObjectID(),
    text: 'this is second to do',
    _creator: uid3,
    completed: true,
    completedAt: 1237283383,
  },
  {
    _id: new ObjectID(),
    text: 'i should be deleted',
    _creator: uid3
  }
]

const populateTodos = (done) => {
  //delete todos
  Todo.deleteMany({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => done())
}

let text = 'Hey I am test'
let new_id = new ObjectID()



module.exports = {todos, populateTodos, text, new_id, users, populateUsers}
