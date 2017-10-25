const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const tokenService = require('../utils/auth/token-service');

module.exports = router
    .post('/signup', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'Password is required'};

        Reviewer.emailExists(email)
            .then(exits => {
                if(exits) {
                    throw { code: 400, error: 'Email already exists'};
                }

                const reviewer = new Reviewer(req.body);
                reviewer.generateHash(password);

                return reviewer.save();
            })
            .then(reviewer => {
                tokenService.sign(reviewer);
            })
            .then(token => res.send({ token }))
            .catch(next);
    });