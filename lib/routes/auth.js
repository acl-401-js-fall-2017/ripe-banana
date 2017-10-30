const router = require('express').Router();
const User = require('../models/user');
const tokenService = require('../utils/token-service');


router
    .post('/signup', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'Password is required.'};

        User.emailExists(email)
            .then(exists => {
                if(exists) {
                    throw { code: 400, error: 'Email already exists' };
                }

                const user = new User(req.body);
                user.generateHash(password);

                return user.save();
            })
            .then(user => tokenService.sign(user))
            .then(token => res.send({ token }))
            .catch(next);
    });



module.exports = router;
