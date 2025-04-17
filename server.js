import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'
import methodOverride from 'method-override'



// ** Routers **
import gamesRouter from './controllers/games.js'
import authRouter from './controllers/auth.js'




// ** Varibles **
const app = express()
const port = process.env.PORT || 3000



// ** Middleware **
app.use(methodOverride('_method'))
app.use(express.urlencoded())
app.use(morgan('dev'))



// ** Routes **

// Home Page - sign in / sign up
app.use('/', authRouter)




// Games (add, explore, show, edit)
app.use('/', gamesRouter)



// Users


// 404 Route



// ** Listen ** 
async function startServers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongoose Database connection established')

        app.listen(port, () => console.log(`Server up and running on port ${port}`))
    } catch (error) {
        console.log(error)
    }
} 
startServers()