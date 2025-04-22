export default function isSignedin(req, res, next) {
    if (req.session.user) {
        return next()
    }
    return res.redirect('/')
}