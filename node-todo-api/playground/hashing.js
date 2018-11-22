const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var pass = '123abc!'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(pass, salt, (err, hash) => {
    console.log(hash)
  })
})

var hashedPass = '$2a$10$gTgcApQK.GGD5ets6WR7l.Pe6nWwLU82iF0BOddj7cbXkF4D3kM6e'

bcrypt.compare(pass, hashedPass, (err, res) => {
  console.log(res)
})
// var message = 'I am Iron Man'
// var hashed = SHA256(message)
//
// console.log(`message: ${message}`)
// console.log(`hashed: ${hashed}`)
//
// var data = {
//   id: 4
// }
//
// var token = jwt.sign(data, '123123')
// console.log(token)
//
// var decoded = jwt.verify(token, '123123')
// console.log(decoded)

// var token = {
//   data,
//   hashed: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// //hacking data scenario
// token.data.id = 8
// token.hashed = SHA256(JSON.stringify(data)).toString()
//
// //verification process
// var hashedResult = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
//
// if(hashedResult === token.hashed){
//   console.log('Data was not changed')
// }else{
//   console.log('Something Fishy')
// }
