const request = require('request')

geocodeAddress = (location, callback) => {
  URIencodedLocation = encodeURIComponent(location)
  var url = `https://api.tomtom.com/search/2/search/${URIencodedLocation}.json?key=HUxWDYGx3bjNLzsYg6SYMF6z8KX4NLsA&countrySet=KE`

  request({
    url:url,
    json:true
  }, (error, response, body) => {
    if(error){
      callback('Unable to connect to TOMTOM API')
    }else if(body === '<h1>596 Service Not Found</h1>'){
      callback('Please check your URL, something is wrong')
    }else if (body.results.length === 0) {
      callback(`Unable to find location name, ${location}`)
    }else if (body.results.length > 0){
      body.results.forEach((loc) => {
        if (loc.type === 'POI'){
          callback(undefined, {
            place: `${loc.poi.name}`,
            latitude: `${loc.position.lat}`,
            longitude: `${loc.position.lon}`
          })
        }else if(loc.type === 'Street'){
          callback(undefined, {
            street: `${loc.address.streetName}`,
            latitude: `${loc.position.lat}`,
            longitude: `${loc.position.lon}`
          })
        }else{
          callback('Something is wrong', loc.results)
        }
      })
    }
  })
}

module.exports = {
  geocodeAddress
}
