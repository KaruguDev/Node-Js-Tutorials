const _ = require('lodash')
const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  email:{
    type: String,
    validate:{
      validator:validator.isEmail,
      message: '{VALUE} is not a valid email'
    },
    required: true,
    trim: true,
    minlength:1,
    unique: true
  },
  password:{
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

//Overide Method
UserSchema.methods.toJSON = function(){
  var user = this
  var userObj = user.toObject()

  return _.pick(userObj, ['_id', 'email'])
}

//Custom method
UserSchema.methods.generateAuthToken = function(){
  var user = this
  var access = 'auth'
  var token = jwt.sign({_id: user._id.toHexString(), access}, 's3cr3t').toString()

  user.tokens = user.tokens.concat([{access, token}])
  return user.save().then(() =>{
    return token
  })
}

//Custom Model method
UserSchema.statics.findByToken = function(token){
  var User = this
  var decoded

  try {
    decoded = jwt.verify(token, 's3cr3t')
  }catch(e){
    return Promise.reject()
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
}

UserSchema.statics.findByCredentials = function(email, password){
  var User = this

  return User.findOne({email}).then((user) => {
    if(!user){
      return Promise.reject()
    }

  return new Promise((resolve, reject) => {
    //verify password
    bcrypt.compare(password, user.password,(err,res) => {
      if(res){
        resolve(user)
      }else{
        reject()
      }
    })
  })
})
}

UserSchema.pre('save', function(next){
  var user = this

  if(user.isModified('password')){
    var pass = user.password

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(pass, salt, (err, hash) =>{
        user.password = hash
        next()
      })
    })
  }else{
    next()
  }
})

var User = mongoose.model('User', UserSchema )

module.exports = {User}
