import mongoose from 'mongoose'
import 'dotenv/config'

// ** Models **
import User from '../models/User.js'
import Game from '../models/Game.js'

// ** Seed data **
import gameData from './data/games.js'
import userData from './data/users.js'


async function seedData() {
    try {
        // Connect to mongoose
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB connection established')

        // Remove users from db
        const deletedUsers = await User.deleteMany()
        console.log(`${deletedUsers.deletedCount} users deleted from the db`)

        // Remove games from db
        const deletedGames = await Game.deleteMany()
        console.log(`${deletedGames.deletedCount} games deleted from the db`)

        // Create users
        const users = await User.create(userData)
        console.log(`${users.length} users added to the db`)

        // Add authors to the game posts
        const gamesWithAuthors = gameData.map((game) => {
            game.author = users[Math.floor(Math.random() * users.length)]._id
            return game
        })
        
        // Create games
        const games = await Game.create(gamesWithAuthors)
        console.log(`${games.length} games added to the db`)

        // Close connection to MongoDB
        await mongoose.connection.close()
        
    } catch (error) {
        console.log(error)
        await mongoose.connection.close()
    }
}

seedData()