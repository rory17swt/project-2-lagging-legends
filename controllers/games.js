import mongoose from 'mongoose'
import express from 'express'
import Game from '../models/Game.js'
import { error } from 'console'
import isSignedIn from '../middleware/isSignedIn.js'
import parser from '../middleware/parser.js'



const router = express.Router()

// ** Routes that render web pages **

// explore - games index
router.get('/games/explore', async (req, res) => {
    try {
        const allGames = await Game.find()
        return res.render('games/explore.ejs', {
            games: allGames
        })
    } catch (error) {
        console.log(error)
    }
})


// add - add a game to explore
router.get('/games/add', isSignedIn, (req, res) => {
    try {
        return res.render('games/add.ejs', {
            errorMessage: error.message
        })
    } catch (error) {
        console.log(error)
    }
})


// show - view a selected game
router.get('/games/:gameId', async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return next()
        }
        const game = await Game.findById(req.params.gameId).populate(['author'])
        if (!game) return next()

        return res.render('games/show.ejs', {
            game: game
        })
    } catch (error) {
        console.log(error)
    }
})

// edit - edit a selected game
router.get('/games/:gameId/edit', isSignedIn, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return next()
        }
        const game = await Game.findById(req.params.gameId)
        if (!game) return next()

        if (!game.author.equals(req.session.user._id)) {
            return res.redirect(`/games/${game._id}`)
        }
        return res.render('games/edit.ejs', {
            game: game
        })
    } catch (error) {
        console.log(error)
    }
    
})



// ** Routes that don't render a web page **

// Add - add a game to the explore page
router.post('/games', isSignedIn, parser.single('gameImage'), async (req, res) => {
    try {
        
        req.body.gameImage = req.file.path

        req.body.author = req.session.user._id

        const addGame = await Game.create(req.body)
        return res.redirect(`/games/${addGame._id}`)
    } catch (error) {
        console.log(error.message)
        return res.render('games/add.ejs', {
            errorMessage: error.message
        })
    }
})

// Update
router.put('/games/:gameId', isSignedIn, parser.single('gameImage'), async (req, res, next) => {
    try {
        req.body.gameImage = req.file.path

        const gameId = req.params.gameId

        if(!mongoose.isValidObjectId(gameId)) {
            return next()
        }

        await Game.findByIdAndUpdate(gameId, req.body)
        return res.redirect(`/games/${gameId}`)

    } catch (error) {
        console.log(error)
    }
})


// Delete
router.delete('/games/:gameId', isSignedIn, async (req, res, next) => {
    try {
        if (!mongoose.isValidObjectId(req.params.gameId)) {
            return next()
        }
        await Game.findByIdAndDelete(req.params.gameId)
        return res.redirect('/games/explore')
    } catch (error) {
        console.log(error)
    }
})





export default router