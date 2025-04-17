import mongoose from 'mongoose'
import express from 'express'
import Game from '../models/Game.js'

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
router.get('/games/add', (req, res) => {
    try {
        return res.render('games/add.ejs')
    } catch (error) {
        console.log(error)
    }
})


// show - view a selected game
router.get('/games/:gameId', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId)
        return res.render('games/show.ejs', {
            game: game
        })
    } catch (error) {
        console.log(error)
    }
})

// edit - edit a selected game
router.get('/games/:gameId/edit', async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId)
        return res.render('games/edit.ejs', {
            game: game
        })
    } catch (error) {
        console.log(error)
    }
    
})



// ** Routes that don't render a web page **

// Add - add a game to the explore page
router.post('/games', async (req, res) => {
    try {
        const addGame = await Game.create(req.body)
        return res.redirect('/games/explore')
    } catch (error) {
        console.log(error)
    }
})

// Update
router.put('/games/:gameId', async (req, res) => {
    try {
        const gameId = req.params.gameId

        await Game.findByIdAndUpdate(gameId, req.body)

        return res.redirect(`/games/${gameId}`)

    } catch (error) {
        console.log(error)
    }
})


// Delete
router.delete('/games/:gameId', async (req, res) => {
    try {
        await Game.findByIdAndDelete(req.params.gameId)
        return res.redirect('/games')
    } catch (error) {
        console.log(error)
    }
})





export default router