const path = require('path')
const express = require('express')

const publicPath = path.join(__dirname, '..', 'public')
const config = path.join(__dirname, '..', 'config', 'config.js')

//enviroment configurations
require(config)

var app = express()

//static files
app.use(express.static(publicPath))

//intiialize express
app.listen(process.env.PORT, () => {
  console.log(`I am alive running on port ${process.env.PORT}`)
})
