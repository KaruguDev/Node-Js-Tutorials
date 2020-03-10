const getUser = (id, callback) => {

  const user = {
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

const add = (a, b, callback) => {
  setTimeout(() => {
    callback(a+b)
  }, 2000);
}

add(1,5, (total)=>{
  console.log(total)
})