const {MongoClient, ObjectID} = require('mongodb')

var db_name = 'toDodb'
var mongodb_url = `mongodb://127.0.0.1:27017/${db_name}`

MongoClient.connect(mongodb_url, { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Connection to MongoDB Server failed ')
  }
  db = client.db(db_name)

  db.collection('ToDos').find({name: 'Paul K'}).toArray().then((docs) => {
    console.log(`ToDos count: ${docs.length}`)
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch ToDos', err)
  })
  //close the connection
  client.close()
})
