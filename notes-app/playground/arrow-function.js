var square = x =>  x*x

console.log(square(5))

var user = {
  name: 'Paul',
  sayHi:() => {
    console.log(arguments)
    console.log(`Hi! I am ${this.name}`)
  },
  sayHiAlt(){
    console.log(arguments)
    console.log(`Hi! I am ${this.name}`)
  }
}

user.sayHi(1,2,3)
user.sayHi()

user.sayHiAlt(1,2,3)
user.sayHiAlt()
