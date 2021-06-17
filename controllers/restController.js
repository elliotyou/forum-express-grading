const restController = {
  getRestaurants: (req, res) => {
    console.log('into controllers/restController')
    return res.render('restaurants')
  }
}
module.exports = restController