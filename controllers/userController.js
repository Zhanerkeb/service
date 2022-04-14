const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const keys = require('../config/keys');

const validateRegisterInput = require('../validation/register');

exports.register = (req, res) => {
    const {errors, isNotValid} = validateRegisterInput(req.body);

    if (isNotValid) {
        return res.status(400).send({error: "Password field should contain at least 6 chars and at most 40 chars"});
    }

    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    db.User
        .findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            if (user) {
                res.status(400).send({error: "There are already user with this email"})
                return
            }

            const newUser = {
                name: name,
                email: email,
                password: password
            };

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    db.User.create(newUser)
                        .then(user => {

                            res.json(user);
                        })
                        .catch(err => console.log(err))
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Error while user registration'});
        })
};

exports.login = (req, res) => {
    let errors = {}

    let email = req.body.email;
    let password = req.body.password;

    db.User
        .findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            if (!user) {
                errors.error = "There not user with such email";
                res.status(400).send(errors);
                return;
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // User matched

                        // Create JWT Payload
                        const payload = {
                            id: user.id,
                            name: user.name,
                        };

                        // Sign token
                        jwt.sign(
                            payload,
                            keys.passportKey,
                            {expiresIn: 1001101},
                            (err, token) => {
                                res.send({
                                    success: true,
                                    id: user.id,
                                    token: token,
                                    role: user.role,
                                });
                            }
                        );
                    } else {
                        errors.error = 'Password incorrect';
                        return res.status(400).send(errors);
                    }
                })
                .catch(err => {
                    console.log(err);
                    errors.error = "Error while comparing passwords";
                    return res.status(500).send(errors)
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).send({error: 'Server error while user authorization'})
        })
};