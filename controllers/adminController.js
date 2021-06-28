const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { Restaurant, User, Category } = require('../models')

const adminService = require('../services/adminService')

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/create', { categories })
    } catch (err) {
      console.error(err)
    }
  },
  postRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_msg', 'name did not exist')
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            CategoryId: req.body.categoryId
          })
          req.flash('success_msg', 'restaurant was successfuly created')
          return res.redirect('/admin/restaurants')
        })
      } else {
        await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        })
        req.flash('success_msg', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.error(err)
    }
  },
  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
      return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },
  editRestaurant: async (req, res) => {
    try {
      const [categories, restaurant] = await Promise.all([
        Category.findAll({ raw: true, nest: true }),
        Restaurant.findByPk(req.params.id)
      ])
      return res.render('admin/create', { categories, restaurant: restaurant.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },
  putRestaurant: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_msg', 'name did not exist')
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          })
          req.flash('success_msg', 'rstaurant was successfully updated')
          return res.redirect('/admin/restaurants')
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        })
        req.flash('success_msg', 'restaurant was successfully updated')
        return res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.error(err)
    }
  },
  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.error(err)
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      console.error(err)
    }
  },
  putUsers: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      const isAdmin = !user.isAdmin
      await user.update({ isAdmin })
      req.flash('success_msg', 'user was successfully updated')
      return res.redirect('/admin/users')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController