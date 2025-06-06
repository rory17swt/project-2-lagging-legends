import serverless from 'serverless-http'
import bodyParser from '../../middleware/bodyPerser.js'

import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import 'dotenv/config'
import methodOverride from 'method-override'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passUserToView from '../.././middleware/passUserToView.js'
import passErrorToView from '../.././middleware/passErrorToView.js'



// ** Routers **
import gamesRouter from '../.././controllers/games.js'
import authRouter from '../.././controllers/auth.js'





// ** Varibles **
const app = express()
const port = process.env.PORT || 3000



// ** Middleware **
app.use(methodOverride('_method'))

app.use(bodyParser)

app.use(morgan('dev'))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  }))


// ** Custom Middleware**
app.use(passUserToView)
app.use(passErrorToView)



// ** Routes **

// Home Page - sign in / sign up
app.use('/', authRouter)


// Games (add, explore, show, edit)
app.use('/', gamesRouter)


// 404 Route
app.get('/{*any}', (req, res) => {
  return res.status(404).render('404.ejs')
})


// ** Listen ** 
async function startServers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Mongoose Database connection established')

    } catch (error) {
        console.log(error)
    }
} 
startServers()

export const handler = serverless(app)