console.log('Starting app')

setTimeout(() => {
  console.log('Timeout 1 complete')
}, 2000)

setTimeout(() => {
  console.log('Timeout 2 complete')
}, 0)

console.log('Finishing app')
