const bcrypt = require('bcryptjs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const { Favorite, Like, User, Comment, Restaurant, Followship } = require('../models')
const helpers = require('../_helpers')

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

  getUser: async (req, res) => {
    const isMySelf = helpers.getUser(req).id.toString() === req.params.id.toString()
    try {
      const comments = await Comment.findAll({
        include: Restaurant,
        where: { UserId: req.params.id },
        raw: true,
        nest: true
      })
      const restaurants = comments.map(comment => comment.Restaurant)
      console.log('into userController/line69...req.params.id', req.params.id)
      const targetedUser = await User.findByPk(req.params.id)
      return res.render('user', {
        targetedUser: targetedUser.toJSON(),
        restaurants,
        isMySelf
      })
    } catch (err) {
      console.error(err)
    }
  },

  editUser: (req, res) => {
    const isMySelf = helpers.getUser(req).id.toString() === req.params.id.toString()
    if (!isMySelf) {
      req.flash('error_msg', 'you can only edit your own profile!')
      return res.redirect(`/users/${req.params.id}`)
    }
    return User.findByPk(req.params.id)
      .then(user => {
        return res.render('editUser', { user: user.toJSON() })
      })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', 'name doesn\'t exist')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image
            }).then(() => {
              req.flash('success_msg', 'user was successfully updated')
              res.redirect(`/users/${user.id}`)
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then(user => {
          user.update({
            name: req.body.name,
            image: user.image
          }).then(() => {
            req.flash('success_msg', 'user was successfully updated')
            res.redirect(`/users/${user.id}`)
          })
        })
    }
  },

  addFavorite: async (req, res) => {
    try {
      await Favorite.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeFavorite: async (req, res) => {
    try {
      const favorite = await Favorite.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      await favorite.destroy()
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeLike: async (req, res) => {
    try {
      const like = await Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      await like.destroy()
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  getTopUser: async (req, res) => {
    try {
      let users = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users })
    } catch (err) {
      console.error(err)
    }
  },

  addFollowing: async (req, res) => {
    try {
      await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeFollowing: async (req, res) => {
    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      await followship.destroy()
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController