const express = require('express')
const hbs = require('hbs')

var app = express()

hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs')

//helpers
hbs.registerHelper('getCurrentFullYear', () => {
  return new Date().getFullYear()
})

//middleware
app.use(express.static(__dirname + '/public'))

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
app.listen(3000, () => {
  console.log('Sever is running on port 3000')
})
