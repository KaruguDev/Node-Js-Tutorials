const {MongoClient, ObjectID} = require('mongodb')

var db_name = 'toDodb'
var mongodb_url = `mongodb://127.0.0.1:27017/${db_name}`

MongoClient.connect(mongodb_url, { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Connection to MongoDB Server failed ')
  }
  db = client.db(db_name)
  db.collection('ToDos').insertMany([
    {
      date: '2018-11-02',
      task: 'Meeting at Upande'
    },
    {
      date: '2018-11-04',
      task: 'Meeting with KEWASCO MD',
      location: 'Kericho'
    }
  ], (err, results) => {
    if(err){
      return console.log(err)
    }

    console.log(JSON.stringify(results.ops, undefined, 2))
  })

  console.log('Connection to MongoDB Server successful')
  client.close()
})
