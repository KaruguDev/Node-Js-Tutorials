var getUser = (id, callback) => {

  var user = {
    id:id,
    name: 'Steve Ackel'
  }

  //
  setTimeout(() => {
    callback(user)
  }, 3000)
}

getUser(31, (usrObj) => {
  console.log(usrObj)
})
