const router = require('express').Router();
const Reviewer = require('../models/reviewer');
const tokenService = require('../utils/token-service');
const respond = require('../utils/respond');

module.exports = router
    .post('/signup', respond( async req => {
        const { email, password } =req.body;
        delete req.body.password;
        delete req.body.roles;

        if (!password) throw { code:400, error: 'password is required!'};

        const exists = await Reviewer.emailExists(email);
        if (exists) throw {code: 400, error:' reviewer with this email already exists'};

        const reviewer = new Reviewer(req.body);
        reviewer.generateHash(password);

        const savedReviewer = await reviewer.save();
        const token =  await tokenService.sign(savedReviewer);
        return {token};
    }))

    .post('/signin', respond( async req => {
        const { email, password } = req.body;
        delete req.body.password;

        if (!password) throw { code:400, error: 'password is required!'};

        const reviewer = await Reviewer.findOne({email});
        if (!reviewer || !reviewer.comparePassword(password)) {
            throw{ code:401, error: 'authentication failed' };
        }

        const token = await tokenService.sign(reviewer);
        return ({ token });
    }));