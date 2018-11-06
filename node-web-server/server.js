const express = require('express')
const hbs = require('hbs')
const fs = require('fs')

var app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

//helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
})

hbs.registerHelper('Capitalize', (text) => {
  return text.toUpperCase()
})

//middleware
app.use((req, resp, next) => {
  var now = new Date().toString()
  var log = `${now} ${req.method}, ${req.url}`

  fs.appendFile('server.log', log + '\n', (err) => {
    if(err){
      console.log('unable to write in server.log file')
    }
  })

  next()
})

app.use((req, resp, next) => {
  resp.render('maintenance.hbs', {
    Page: 'Maintenance Page',
    Title: 'Maintenance',
    Message:'We Will be right back'
  })
})

app.use(express.static(__dirname + '/public'))

//routes
app.get('/', (req, resp) => {
  resp.render('home.hbs', {
    Page: 'Home Page',
    Message: 'Welcome to my home page, I am glad you visited'
  })
})

app.get('/about', (req, resp) => {
  resp.render('about.hbs', {
    Page: 'About Page'
  })
})

app.get('/bad', (req, resp) => {
  resp.send({
    Error: 'Unable to locate page'
  })
})

//
app.listen(4000, () => {
  console.log('Sever is running on port 4000')
})
