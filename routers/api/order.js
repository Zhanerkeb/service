const orderRouter = require("express").Router();
const orderController = require("../../controllers/orderController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin

orderRouter.post('/', passport.authenticate('jwt', {session: false}),
    orderController.addOrder)
orderRouter.get('/', passport.authenticate('jwt', {session: false}), orderController.getById)

module.exports.orderRouter = orderRouter