const { Restaurant, Category } = require('../models')

const adminService = {
  getRestaurants: async (req, res, callback) => {
    const restaurants = await Restaurant.findAll({ include: [Category] })
    return callback({ restaurants })
  }
}

module.exports = adminService