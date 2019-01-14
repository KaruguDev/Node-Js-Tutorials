const expect = require('expect')
const {Users} = require('./users')

describe('Users', () => {
  var users

  beforeEach(() => {
    users = new Users()
    users.users = [
      {
        id: 1,
        name: 'Paul',
        room: 'Alpha'
      },{
        id: 2,
        name: 'Steve',
        room: 'Beta'
      },{
        id: 3,
        name: 'Ken',
        room: 'Alpha'
      },{
        id: 34,
        name: 'Kezy',
        room: 'Omega'
      }
    ]
  })

  it('create a user', () => {
    var user = {
      id: '9',
      name: 'Simon',
      room: 'Alpha'
    }
    var result = users.addUser(user.id, user.name, user.room )
    expect(users.users).toContain(result)
  })
  it('user found', () => {
    var user = users.users[1]
    var result = users.getUser(user.id)
    expect(result).toBe(user)
  })
  it('user not found', () => {
    var id = 'er45'
    var result = users.getUser(id)
    expect(result).toBeUndefined()
  })
  it('get user list', () => {
    var userNamesArray = users.getUserList('Alpha')
    expect(userNamesArray).toEqual(['Paul', 'Ken'])
  })
  it('remove a user', () => {
    var user = users.users[3]
    var result = users.removeUser(user.id)
    expect(users.users).not.toContain(user)
  })
  it('check if user exists', () => {
    var user = {name: 'Ken', room: 'Alpha'}
    var result = users.ifUserExists(user.name, user.room)
    expect(users.users).toContain(result)
  })
  it('get rooms list', () => {
    var roomsArray = users.getRoomsList()
    expect(roomsArray).toEqual(['Alpha', 'Beta', 'Omega'])
  })
})
