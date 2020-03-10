const request = require('request')

const getWeather = (lat,lon, callback) => {
  const url = `https://api.darksky.net/forecast/9f6e1d0080c6e9f83aef91b0cfffc093/${lat},${lon}`
  
  request({url,json:true}, (err, resp, body) => {
    if(!err && resp.statusCode === 200){
      callback(undefined, {
        temperature:body.currently.temperature,
        apparentTemperature:body.currently.apparentTemperature
      })
    }else{
      callback('unable to fetch weather from forecast.io')
    }

  })
}

module.exports = {
  getWeather
}
