const sinon = require('sinon')
const rewire = require('rewire')

var app = rewire('./app')

describe('Spy', () => {
  var db = {
    saveUser: sinon.spy()
  }

  app.__set__('db', db)

  it('call spy correctly', () => {
    var spy = sinon.spy()
    spy()
    sinon.assert.called(spy)
  })

  it('call saveUser with user object', () => {
    var email = 'paul@example.com'
    var password = '123asd'

    app.handleSignUP(email, password)
    sinon.assert.calledWith(db.saveUser,{email, password})
  })
})
