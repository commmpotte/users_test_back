import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import {
    registerValidation,
    loginValidation
} from './validations/validations.js'

import {
    handleValidationErrors
}
from './utils/index.js'
import {
    UserController
} from './controllers/index.js'

// mongodb+srv://admin:wwwwww@cluster0.z3xly8z.mongodb.net/blog?retryWrites=true&w=majority
// mongodb+srv://admin:admin@cluster1.67zyeye.mongodb.net/

// mongoose.connect(process.env.MONGODB_URI).then(() => console.log('DB ok')).catch((err) => console.log('DB error', err))
mongoose.connect('process.env.MONGODB_URI').then(() => console.log('DB ok')).catch((err) => console.log('DB error', err))
// mongodb+srv://admin:admin@cluster1.67zyeye.mongodb.net/main

const app = express()


app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Here is a test task for Emphasoft!')
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)

app.get('/users', UserController.getAllUsers)
// app.post('/users', registerValidation, handleValidationErrors, UserController.usersPost)

app.get('/users/:id', UserController.getOneUser)
app.put('/users/:id', UserController.updateUser)
app.patch('/users/:id', UserController.patchUser)
app.delete('/users/:id', UserController.deleteUser)


app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('Server OK')
    }
})