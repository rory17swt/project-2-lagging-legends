import { kMaxLength } from 'buffer'
import mongoose from 'mongoose'



// Game schema
const gameSchema = new mongoose.Schema({
    gameImage: { type: String, required: true },
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true},
    tags: [String],
}, {
    timestamp: true
})


const Game = mongoose.model('Game', gameSchema)

export default Game