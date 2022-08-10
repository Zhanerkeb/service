const reviewRouter = require("express").Router();
const reviewController = require("../../controllers/reviewController");
const passport = require('passport/lib');
const adminAuth = require('../../validation/Auth').isAdmin

reviewRouter.post('/', passport.authenticate('jwt', {session: false}),
    reviewController.addReview)
reviewRouter.get('/', reviewController.getReviews)
reviewRouter.delete('/:reviewId', passport.authenticate('jwt', {session: false}),
    adminAuth, reviewController.deleteReview)

module.exports.reviewRouter = reviewRouter