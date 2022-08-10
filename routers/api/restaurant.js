const restaurantRouter = require("express").Router();
const restaurantController = require("../../controllers/restaurantController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin
const upload = require('../../config/fileUpload').upload('image')

restaurantRouter.post('/', passport.authenticate('jwt', {session: false}),
    adminAuth, upload, restaurantController.addRestaurant)
restaurantRouter.get('/get', restaurantController.getRestaurants)
restaurantRouter.get('/:restaurantId', passport.authenticate('jwt', {session: false}),
    restaurantController.getById)
restaurantRouter.get('/', restaurantController.searchRestaurants)
restaurantRouter.put('/:restaurantId', upload, passport.authenticate('jwt', {session: false}),
    adminAuth, restaurantController.updateRestaurant)
restaurantRouter.delete('/:restaurantId', passport.authenticate('jwt', {session: false}),
    adminAuth, restaurantController.deleteRestaurant)

module.exports.restaurantRouter = restaurantRouter