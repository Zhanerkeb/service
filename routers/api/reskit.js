const reskitRouter = require("express").Router();
const reskitController = require("../../controllers/reskitController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin
const upload = require('../../config/fileUpload').upload('image')

reskitRouter.put('/:restaurantId', upload, passport.authenticate('jwt', {session: false}),
    adminAuth, reskitController.updateReskit)

module.exports.reskitRouter = reskitRouter