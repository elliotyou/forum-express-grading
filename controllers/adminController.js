const fs = require('fs')
const { isBuffer } = require('util')
const db = require('../models')
const restaurant = require('../models/restaurant')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    // return res.render('admin/restaurants')
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_msg', 'name did not exist')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null
          }).then(() => {
            req.flash('success_msg', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then(() => {
        req.flash('success_msg', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        return res.render('admin/create', { restaurant })
      })
  },
  putRestaurant: (req, res) => {
    console.log('into adminController/putRestaurant...')
    if (!req.body.name) {
      req.flash('error_msg', 'name did not exist')
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      console.log('--into if(file), file=', file)
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          console.log(`--into fs.writeFile...path=upload/${file.originalname}`)
          return Restaurant.findByPk(req.params.id)
            .then(restaurant => {
              restaurant.update({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? `/upload/${file.originalname}` : restaurant.image
              }).then((restaurant) => {
                console.log('after uploading ... restaurant.img=', restaurant.image)
                req.flash('success_msg', 'restaurant was successfully updated')
                res.redirect('/admin/restaurants')
              })
            })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.imag
          }).then(() => {
            req.flash('success_msg', 'restaurant was successfully updated')
            res.redirect('/admin/restaurants')
          })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        restaurant.destroy()
          .then(() => { res.redirect('/admin/restaurants') })
      })
  }
}

module.exports = adminController