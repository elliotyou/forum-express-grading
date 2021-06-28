const { Restaurant, Category } = require('../../models')

const adminController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({ include: [Category] })
    return res.json({ restaurants })
  }
}

module.exports = adminController