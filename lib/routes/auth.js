const router = require('express').Router();
const Reviewer = require('../models/Reviewer');
const tokenService = require('../utils/auth/token-service');
const ensureAuth = require('../utils/auth/ensure-auth');

module.exports = router
    .get('/verify', ensureAuth, (req, res) => {
        res.json({ verified: true });
    })

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
                return tokenService.sign(reviewer);
            })
            .then(token => {
                res.send({token});
            })
            .catch(next);
    })

    .post('/signin', (req, res, next) => {
        const { email, password } = req.body;
        delete req.body.password;

        if(!password) throw { code: 400, error: 'password is required'};

        Reviewer.findOne({ email })
            .then(reviewer => {
                if(!reviewer || !reviewer.comparePassword(password)) {
                    throw { code: 401, error: 'authenication failed' };
                }
                return tokenService.sign(reviewer);
            })
            .then(token => res.send({ token }))
            .catch(next);
    });