import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import isSignedOut from '../middleware/isSignedOut.js'


const router = express.Router()



// ** Routes **

// home / sign in
router.get('/', isSignedOut, (req, res) => {
    try {
        return res.render('auth/home.ejs', {
            errorMessage: ''
        })
    } catch (error) {
        console.log(error)
    }
})


// sign up 
router.get('/auth/sign-up', isSignedOut, (req, res) => {
    try {
        return res.render('auth/sign-up.ejs', {
            errorMessage: ''
        })
    } catch (error) {
        console.log(error)
    }
})


// * Create a user *
router.post('/auth/sign-up', isSignedOut, async (req, res) => {
    try {
        console.log(req.body)
        if (req.body.password !== req.body.passwordConfirmation) {
            return res.status(422).render('auth/sign-up.ejs', {
                errorMessage: 'Please make sure your passwords match'
            })
        }
        req.body.password = bcrypt.hashSync(req.body.password, 12)

        const newUser = await User.create(req.body)

        return res.redirect('/')

    } catch (error) {
        console.log(error.message)

        if (error.code === 11000) {
            const fieldName = Object.keys(error.keyValue)[0]

            return res.status(422).render('auth/sign-up.ejs', {
                errorMessage: `That ${fieldName} already exists`
            })
        }
        return res.status(400).render('auth/sign-up.ejs', {
            errorMessage: error.message
        })
    }
})


// * Sign in user *
router.post('/', isSignedOut, async (req, res) => {
    try {
        const getUser = await User.findOne({ email: req.body.email })

        if (!getUser) {
            return res.status(401).render('auth/home.ejs', {
                errorMessage: 'Unauthorized'
            })
        }
        // if (!bcrypt.compareSync(req.body.password, getUser.password)) {
        //     return res.status(401).render('auth/home.ejs', {
        //         errorMessage: 'Unauthorized'
        //     })
        // }
        req.session.user = {
            username: getUser.username,
            email: getUser.email,
            _id: getUser._id
        }
        console.log(req.session.user)
        req.session.save(() => {
            return res.redirect('/games/explore')
        })
    } catch (error) {
        console.log(error)
    }
})



// * Sign out user *
router.get('/auth/sign-out', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})



export default router