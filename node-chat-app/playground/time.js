const moment = require('moment')

var date = moment()

console.log(date.format('Do MMM Y HH:MM:SS'))
console.log(date.add(10, 'months').subtract(1,  'year'))
console.log(date.format('h:mm A'))
