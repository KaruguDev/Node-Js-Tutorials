const https = require('https')

const url = 'https://gorest.co.in/public-api/users?_format=json&access-token=jb1_05jac37gyv9BCW7bY_i-aSjmykEMmxHo'

const request = https.request(url, (response) => {

    let data = ''

    response.on('data', (chunk) => {
        data += chunk.toString()
    })

    response.on('end', ()=>{
        const body = JSON.parse(data)
        console.log(body)
    })
    
})

request.on('error', (error) => {
    console.log(error)
})

request.end()
