const {MongoClient, ObjectID} = require('mongodb')

var db_name = 'toDodb'
var mongodb_url = `mongodb://127.0.0.1:27017/${db_name}`

MongoClient.connect(mongodb_url, { useNewUrlParser: true }, (err, client) => {
  if(err){
    return console.log('Connection to MongoDB Server failed ')
  }
  db = client.db(db_name)

  //findOneAndUpdate
  db.collection('Users').findOneAndUpdate(
    {
      _id: new ObjectID("5bed2893bb1696f9414e9b1f")
    },{
      $set:{
        name: 'Eric Maingi'
      },
      $inc:{
        age: -5
      }
    }, {
      returnOriginal: false
    }).then((result) => {
    console.log(result)
  }, (err) => {
    console.log(err)
  })
  //close the connection
  client.close()
})
