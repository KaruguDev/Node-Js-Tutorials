var db = require('./db.js')

module.exports.handleSignUP = (email, password) => {
  //check if email already exists
  db.saveUser({email, password})
  //Send welcome email
}
