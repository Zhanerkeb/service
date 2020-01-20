const favoriteRouter = require("express").Router();
const favoriteController = require("../../controllers/favoriteController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin

favoriteRouter.post('/',passport.authenticate('jwt', {session: false}),
    favoriteController.addFavorites)
favoriteRouter.get('/',passport.authenticate('jwt', {session: false}), favoriteController.getById)



module.exports.favoriteRouter = favoriteRouter