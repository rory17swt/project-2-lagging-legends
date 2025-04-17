import express from 'express'


const router = express.Router()


// ** Routes **

// home / sign in
router.get('/', (req, res) => {
    try {
        return res.render('auth/home.ejs')
    } catch (error) {
        console.log(error)
    }
})


// sign up 
router.get('/auth/sign-up', (req, res) => {
    try {
        return res.render('auth/sign-up.ejs')
    } catch (error) {
        console.log(error)
    }
}) 





export default router