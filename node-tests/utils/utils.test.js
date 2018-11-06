const expect = require('expect')
const utils = require('./utils.js')

it('should add two numbers', () => {
  var res = utils.add(33, 14)
  expect(res).toBe(47)
})

it('should square a number', () => {
   var res = utils.square(10)
   expect(res).toBe(100)
})

//verify first and last names are set
it('should set both first and last name', () =>{
  var user = {age: 26, nationality: 'Kenyan'}
  var result = utils.setName(user, 'Paul K')

  expect(result).toMatchObject({
    firstname: 'Paul',
    lastname: 'K'
  })
})

it('should async add two numbers', (done) => {
  utils.asyncAdd(7, 9, (sum) => {
    expect(sum).toBe(16)
    done();
  })
})

it('should async square a number', (done) => {
  utils.asyncSquare(9, (sq) => {
    expect(sq).toBe(81)
    done()
  })
})

// it('should contain', () => {
//   expect({
//     name: 'Paul',
//     age: 27,
//     location: 'Nairobi'
//   }).toMatchObject({
//     name: 'Paul'
//   })
// })
