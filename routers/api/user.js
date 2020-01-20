const userRouter = require("express").Router();
const userController = require("../../controllers/userController");
const passport = require('passport/lib');


userRouter.post('/register', userController.register);

userRouter.post('/login', userController.login);

module.exports.userRouter = userRouter;