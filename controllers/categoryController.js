const { Category } = require('../models')

const categoryService = require('../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
    categoryService.getCategories(req, res, (data) => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_msg', 'name doesn\'t exist')
        return res.redirect('back')
      } else {
        await Category.create({ name: req.body.name })
        res.redirect('/admin/categories')
      }
    } catch (err) {
      console.error(err)
    }
  },
  putCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_msg', 'name doesn\'t exist')
        return res.redirect('back')
      } else {
        const category = await Category.findByPk(req.params.id)
        await category.update(req.body)
        return res.redirect('/admin/categories')
      }
    } catch (err) {
      console.error(err)
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = categoryController