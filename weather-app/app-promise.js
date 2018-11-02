const yargs = require('yargs')
const axios = require('axios')

const argv = yargs
  .options({
    location: {
      demand:false,
      string:true,
      describe: 'A location in Kenya',
      alias: 'l'
    }
  })
  .help()
  .alias('help', 'h')
  .argv

//if location is not specified
location = argv.l !== '' ? argv.l : "KICC"

URIencodedLocation = encodeURIComponent(location)
var geocodeURL = `https://api.tomtom.com/search/2/search/${URIencodedLocation}.json?key=HUxWDYGx3bjNLzsYg6SYMF6z8KX4NLsA&countrySet=KE`

axios.get(geocodeURL).then((resp) => {
  if (resp.data.results.length === 0){
    //throw error if there is no data in results array
    throw new Error(`Unable to find location ${resp.data.summary.query}`)
  }

  resp.data.results.forEach((loc) => {
    if (loc.type === 'POI' || loc.type === 'Street'){
      var latitude = loc.position.lat
      var longitude = loc.position.lon

      var weatherURL = `https://api.darksky.net/forecast/9f6e1d0080c6e9f83aef91b0cfffc093/${latitude},${longitude}`
      var place = loc.type === 'POI' ? loc.poi.name : loc.address.streetName

      axios.get(weatherURL).then((response) => {
        temperature = response.data.currently.temperature,
        apparentTemperature = response.data.currently.apparentTemperature
        precipProbability = response.data.currently.precipProbability

        console.log(place)
        console.log(latitude, longitude)
        console.log(`Its currently ${temperature} but feels like ${apparentTemperature}, probability of it raining is ${precipProbability}`)
      }).catch((err) => {
          if (err.response === 'undefined' || err.code === 'EAI_AGAIN'){
            console.log('unable to connect to forecast.io Servers')
          }else{
            //display error
            console.log(err.message)
          }

      })
    }
  })
}).catch((err) => {
    if (err.response === 'undefined' || err.code === 'EAI_AGAIN'){
      console.log('unable to connect to TomTom API servers')
    }else{
      console.log(err.message)
    }

})
