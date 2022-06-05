const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const PORT = process.env.PORT

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return callback(new Error('Please upload a Word Document'))
        }

        callback(undefined, true)
    }
})



app.post('/upload', upload.single('upload'), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
})

