const request = require('request')

var geocodeAddress = (location) => {
  return new Promise((resolve, reject) => {
    URIencodedLocation = encodeURIComponent(location)
    var url = `https://api.tomtom.com/search/2/search/${URIencodedLocation}.json?key=HUxWDYGx3bjNLzsYg6SYMF6z8KX4NLsA&countrySet=KE`

    request({
      url:url,
      json:true
    }, (error, response, body) => {
      if(error){
        reject('Unable to connect to TOMTOM API')
      }else if(body === '<h1>596 Service Not Found</h1>'){
        reject('Please check your URL, something is wrong')
      }else if (body.results.length === 0) {
        reject(`Unable to find location name, ${location}`)
      }else if (body.results.length > 0){
        locations = []
        body.results.forEach((loc) => {
          if (loc.type === 'POI'){
            locations.push({
              place: `${loc.poi.name}`,
              latitude: `${loc.position.lat}`,
              longitude: `${loc.position.lon}`
            })
          }else if(loc.type === 'Street'){
            locations.push({
              street: `${loc.address.streetName}`,
              latitude: `${loc.position.lat}`,
              longitude: `${loc.position.lon}`
            })
          }else{
            reject('Something is wrong', loc.results)
          }
        })
        resolve(locations)
      }
    })
  })
}

geocodeAddress('95y5').then((loc) =>{
  console.log(JSON.stringify(loc, undefined, 2))
}, (err) => {
  console.log(err)
})
