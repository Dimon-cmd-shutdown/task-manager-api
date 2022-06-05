const mongoose = require('mongoose')

mongoose.connect(process.env.mongodb_url).then(() => {
    console.log('Connected to mongoDB')
}).catch((error) => {
    console.log(error)
})



