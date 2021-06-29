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
  }
}

module.exports = categoryService