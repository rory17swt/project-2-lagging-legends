import { kMaxLength } from 'buffer'
import mongoose, { Schema } from 'mongoose'



// Game schema
const gameSchema = new mongoose.Schema({
    gameImage: { type: String, required: true },
    title: { type: String, required: true, maxlength: 150 },
    description: { type: String, required: true},
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamp: true
})


const Game = mongoose.model('Game', gameSchema)

export default Game