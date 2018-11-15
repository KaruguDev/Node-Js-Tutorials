const {MongoClient, ObjectID} = require('mongodb')

var db_name = 'toDodb'
var mongodb_url = `mongodb://127.0.0.1:27017/${db_name}`

MongoClient.connect(mongodb_url, { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Connection to MongoDB Server failed ')
  }
  db = client.db(db_name)

  //deleteMany
  // db.collection('ToDos').deleteMany({task:'Go for running'}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log('Unable to delete from ToDos', err)
  // })
  // db.collection('Users').deleteMany({name: 'Paul K'}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log(err)
  // })
  //deleteOne
  // db.collection('ToDos').deleteOne({task:'Go to Kericho'}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log(err)
  // })
  // db.collection('ToDos').deleteOne({}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log('Unable to delete from ToDos', err)
  // })
  //
  //findOneAndDelete
  // db.collection('ToDos').findOneAndDelete({completed:'false'}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log(err)
  // })
  db.collection('Users').findOneAndDelete({_id: new ObjectID("5bed2893bb1696f9414e9b20")}).then((result) => {
    console.log(result)
  }, (err) => {
    console.log(err)
  })
  //close the connection
  client.close()
})
