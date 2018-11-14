const {MongoClient, ObjectID} = require('mongodb')

var db_name = 'toDodb'
var mongodb_url = `mongodb://127.0.0.1:27017/${db_name}`

MongoClient.connect(mongodb_url, { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Connection to MongoDB Server failed ')
  }
  db = client.db(db_name)
  // db.collection('ToDos').find({_id: new ObjectID('5be2e5341520c76e7d4cef49')}).toArray().then((docs) => {
  //   console.log(`${docs.length} todo(s) have been found`)
  //   console.log(docs)
  // }, (err) => {
  //   console.log(`unable to fetch records, ${err}`)
  // })

  // db.collection('ToDos').find().count().then((count) => {
  //     console.log(`ToDos count: ${count}`)
  // }, (err) => {
  //   console.log('Unable to fetch ToDos', err)
  // })

  db.collection('Users').find({name: 'Paul K'}).toArray().then((docs) => {
    console.log(`Users count: ${docs.length}`)
    console.log(JSON.stringify(docs, undefined, 2))
  }, (err) => {
    console.log('Unable to fetch Users', err)
  })
  //close the connection
  client.close()
})
