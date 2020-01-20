const kitchenRouter = require("express").Router();
const kitchenController = require("../../controllers/kitchenController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin

kitchenRouter.post('/',passport.authenticate('jwt', {session: false}),
    adminAuth,
    kitchenController.addKitchen)
kitchenRouter.get('/', kitchenController.getKitchens)
kitchenRouter.put('/:kitchenId', passport.authenticate('jwt', {session: false}),
    adminAuth,kitchenController.updateKitchen)
kitchenRouter.delete('/:kitchenId',passport.authenticate('jwt', {session: false}),
    adminAuth, kitchenController.deleteKitchen)


module.exports.kitchenRouter = kitchenRouter