const { Restaurant, Category, Comment, User } = require('../models')
const helpers = require('../_helpers')

const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : ''
      const whereQuery = req.query.categoryId ? { CategoryId: categoryId } : {}
      const offset = req.query.page ? (Number(req.query.page) - 1) * pageLimit : 0
      const result = await Restaurant.findAndCountAll({
        include: Category,
        where: whereQuery,
        offset: offset,
        limit: pageLimit
      })
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => (index + 1))
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      const categories = await Category.findAll({ raw: true, nest: true })

      return res.render('restaurants', {
        restaurants: data,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next
      })
    } catch (err) {
      console.error(err)
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      await restaurant.increment('viewCounts')
      res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (err) {
      console.error(err)
    }
  },

  getFeeds: async (req, res) => {
    try {
      const [restaurants, comments] = await Promise.all([
        Restaurant.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [Category]
        }),
        Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
        })
      ])
      return res.render('feeds', { restaurants, comments })
    } catch (err) {
      console.error(err)
    }
  },

  getRestaurantDashBoard: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, Comment] })
      return res.render('dashboard', { restaurant: restaurant.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },

  getTopRestaurant: async (req, res) => {
    let restaurants = await Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    })
    restaurants = restaurants.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      FavoritedCount: r.FavoritedUsers.length,
      isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
    }))
    restaurants = restaurants.sort((a, b) => b.FavoritedCount - a.FavoritedCount).slice(0, 10)

    return res.render('topRestaurant', { restaurants })
  }
}

module.exports = restController