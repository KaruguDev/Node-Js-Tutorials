const add = (a, b) => {
    return new Promise((resolve, reject) => {
        
        try {
            const result = Number(a) + Number(b)
            if(isNaN(result)){
                reject('only numbers allowed')
            }
            resolve(result)
        }catch(e){
            reject('only numbers are allowed')

        }

    })
}

//promise chaining
add(1,9).then((sum)=>{
    console.log(sum)
    return add('x', 4)
}).then((sum2) => {
    console.log(sum2)
}).catch((e) =>{
    console.log(e)
})