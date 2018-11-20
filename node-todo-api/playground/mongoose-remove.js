const {ObjectID} = require('mongodb')

const {mongoose} = require("./../server/db/mongoose")
const {todo} = require("./../server/models/todo")
const {user} = require("./../server/models/user")

var todo_id = '5bed6127b6eaf1547aaf3e20'

// remove
// todo.remove({}).then((result) => {
//   console.log(result)
// })
// findOneAndRemove
todo.findOneAndDelete({_id: todo_id}).then((todo) => {
  console.log(todo)
})

//findByIdAndRemove
// todo.findByIdAndDelete(todo_id).then((todo) => {
//   console.log(todo)
// })
