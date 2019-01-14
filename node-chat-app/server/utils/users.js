class Users {
  constructor () {
    this.users = []
  }
  addUser(id, name, room){
    var isUser = this.ifUserExists(name, room)
    if (!isUser){
      var user = {id, name, room}
      this.users.push(user)
      return user
    }
    return isUser
  }
  getUser(id){
    var user = this.users.filter((user) => user.id === id)[0]
    return user
  }
  getUserList(room){
    var users = this.users.filter((user) => user.room === room)
    var userNamesArray = users.map((user) => user.name)
    return userNamesArray
  }
  removeUser(id){
    var user = this.getUser(id)
    if(user){
        this.users = this.users.filter((user) => user.id !== id)
    }
    return user
  }
  ifUserExists(name, room){
    var user = this.users.filter((user) => user.name === name && user.room === room)[0]
    return user
  }
  getRoomsList(){
    var rooms = this.users.map((user) => user.room)
    var roomsArray = Array.from(new Set(rooms))
    return roomsArray
  }
}

module.exports = {Users}
