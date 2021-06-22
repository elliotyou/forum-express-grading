const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    //confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_msg', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      //comfirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_msg', '信箱重複')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(() => {
            req.flash('success_msg', '成功註冊帳號')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_msg', '成功登入')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_msg', '登出成功')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    console.log('into controllers/userController/line51...req.params.id', req.params.id)
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('profile', { user: user.toJSON() })
      })
  }
}

module.exports = userController