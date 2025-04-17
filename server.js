import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'
import methodOverride from 'method-override'



// ** Routers **




// ** Varibles **
const app = express()
const port = process.env.PORT || 3000



// ** Middleware **
app.use(methodOverride('_method'))

app.use(morgan('dev'))



// ** Routes **

// Home Page

// Games

// Users


// 404 Route



// ** Listen ** 
async function startServers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongoose Database connection established')

        app.listen(port, () => console.log(`Server up and running on port ${port}`))
    } catch (error) {

    }
} 
startServers()