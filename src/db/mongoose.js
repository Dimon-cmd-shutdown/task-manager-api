const mongoose = require('mongoose')
const mongodb_url = require('../../config/mongodb_url.js')

mongoose.connect(mongodb_url).then(() => {
    console.log('Connected to mongoDB')
}).catch((error) => {
    console.log(error)
})



