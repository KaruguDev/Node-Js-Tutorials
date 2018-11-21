//SET ENV
var env = process.env.NODE_ENV || 'development'
//console.log(env)

if(env === 'development'){
  process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoApp'
}else if(env === 'test'){
  process.env.MONGODB_URI = 'mongodb://localhost:27017/ToDoAppTest'
}
