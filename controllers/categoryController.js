const db = require('../models')
const Category = db.Category
const categoryController = {
  getCategories: (req, res) => {
    console.log('into controllers/categoryController/getCategories...')
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then(category => {
            return res.render('admin/categories', {
              categories,
              category: category.toJSON()
            })
          })
      } else {
        return res.render('admin/categories', { categories })
      }
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', 'name doesn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      }).then(() => {
        res.redirect('/admin/categories')
      })
    }
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', 'name doesn\'t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then(category => {
          category.update(req.body)
            .then(() => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(category => { return category.destroy() })
      .then(() => res.redirect('/admin/categories'))
  }
}

module.exports = categoryController