var asyncAdd = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(typeof a === 'number' && typeof b === 'number'){
        resolve(a + b)
      }else{
        reject('Arguments must be numbers')
      }
    }, 1500)
  })
}

//chaining promises
asyncAdd(12, '56').then((res) => {
  console.log('Result: ', res)
  return asyncAdd(res, res* 2)
}).then((res) => {
    console.log(`Should be 204`, res)
}).catch((err) => {
  console.log(err)
})

// var somePromise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve('Everything is Okay')
//     //reject('Something is wrong')
//   }, 2500)
// })
//
// somePromise.then((success) => {
//   console.log("Success: ", success)
// }, (error) => {
//   console.log('Error: ', error)
// })
