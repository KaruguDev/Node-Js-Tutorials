const yargs = require('yargs')
const geocode = require('./geocode/geocode')
const weather = require('./weather/weather')

const argv = yargs
  .options({
    location: {
      demand:true,
      string:true,
      describe: 'A location in Kenya',
      alias: 'l'
    }
  })
  .help()
  .alias('help', 'h')
  .argv

geocode.geocodeAddress(argv.l, (err, gResults) => {
  if (err){
    console.log(err)
  }else{
    //console.log(gResults.place)
    //console.log(JSON.stringify(gResults, undefined, 2))
    weather.getWeather(gResults.latitude, gResults.longitude, (err, wResults) => {
      if (err){
        console.log(err)
      }else{
        console.log(wResults)
        if (gResults.place){
          console.log(gResults.place)
        }else{
          console.log(gResults.street)
        }
        console.log(`It's currently ${wResults.temperature} but feels like ${wResults.apparentTemperature}`)
        //console.log(JSON.stringify(wResults, undefined, 2))
      }
    })
  }
})

var lat = -1.343
var lon = 36.789
