import mongoose from 'mongoose'
import express from 'express'

const router = express.Router()

// ** Routes that render web pages **

// explore - games index
router.get('/games/explore', (req, res) => {
    try {
        return res.render('games/explore.ejs')
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
router.get('/games/show', (req, res) => {
    try {
        return res.render('games/show.ejs')
    } catch (error) {
        console.log(error)
    }
})

// edit - edit a selected game
router.get('/games/edit', (req, res) => {
    try {
        return res.render('games/edit.ejs')
    } catch (error) {
        console.log(error)
    }
})


// Delete - allows a user to delete an exisiting game





export default router