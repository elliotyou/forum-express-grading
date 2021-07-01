const { Category } = require('../models')

const categoryService = {
  getCategories: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        return res.render('admin/categories', {
          categories,
          category: category.toJSON()
        })
      } else {
        return callback({ categories })
      }
    } catch (err) {
      console.error(err)
    }
  },
  postCategory: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        return callback({ status: 'error', message: 'name doesn\'t exist' })
      } else {
        await Category.create({ name: req.body.name })
        return callback({ status: 'success', message: 'new category has been created successfully' })
      }
    } catch (err) {
      console.error(err)
    }
  },
  putCategory: async (req, res, callback) => {
    try {
      if (!req.body.name) {
        callback({ status: 'error_msg', message: 'name doesn\'t exist' })
      } else {
        const category = await Category.findByPk(req.params.id)
        await category.update(req.body)
        callback({ status: 'success', message: 'category modified successfully' })
      }
    } catch (err) {
      console.error(err)
    }
  },
  deleteCategory: async (req, res, callback) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return callback({ status: 'success', message: '' })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = categoryService