const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    console.log('into authenticated...routes/index.js')
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    console.log('into authenticatedAdmin...routes/index.js/')
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next()
      }
    }
    return res.redirect('/signin')
  }

  app.get('/restaurants', authenticated, restController.getRestaurants)

  app.get('/admin', authenticatedAdmin, (req, res) => {
    console.log('into routes/index/admin/line28')
    res.redirect('/admin/restaurants')
  })
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)

  app.get('/', authenticated, (req, res) => {
    console.log('into / ...routes/index.js')
    res.redirect('/restaurants')
  })
}
