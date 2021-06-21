const db = require('../models')
const categoryController = require('./categoryController')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : ''
    const whereQuery = req.query.categoryId ? { CategoryId: categoryId } : {}

    const restaurants = await Restaurant.findAll({ include: Category, where: whereQuery })
    const data = restaurants.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    const categories = await Category.findAll({ raw: true, nest: true })

    return res.render('restaurants', { restaurants: data, categories, categoryId })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: Category })
      .then(restaurant => {
        res.render('restaurant', { restaurant: restaurant.toJSON() })
      })
  }
}
module.exports = restController