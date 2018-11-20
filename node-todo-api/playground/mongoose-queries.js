const {ObjectID} = require('mongodb')

const {mongoose} = require("./../server/db/mongoose")
const {todo} = require("./../server/models/todo")
const {user} = require("./../server/models/user")

var user_id = "5bed4d7c2429ab3a37b2f307"

user.find({
  _id: user_id
}).then((user) => {
  console.log("users", user)
})

user.findOne({
  _id: user_id
}).then((user) => {
  console.log("user", user)
})

user.findById(user_id)
  .then((user) => {
    if(!user){
      return console.log("user not found")
    }
    console.log("user by id", user)
  }).catch((err) => {console.log(err)})
// var todo_id = "5bed36f3fda5eb4b711fec03"
//
// if (!ObjectID.isValid(todo_id)){
//   return console.log(`ID:${todo_id} is not Valid`)
// }
// todo.find({
//   _id:todo_id
// }).then((todo) => {
//   console.log("todos", todo)
// })
//
// todo.findOne({
//   _id: todo_id
// }).then((todo) => {
//   console.log("todo", todo)
// })

// todo.findById(todo_id).then((todoById) => {
//   if(!todoById){
//     return console.log('Id not found')
//   }
//   console.log("todoById", todoById)
// }).catch((e) => {console.log(e)})
