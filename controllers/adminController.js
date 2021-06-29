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
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
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
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status' === 'error']) {
        req.flash('err0r_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        res.redirect('/admin/restaurants')
      }
    })
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