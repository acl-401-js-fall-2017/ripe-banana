const router = module.exports = require('express').Router();
const respond = require('../utils/respond');
const User = require('../models/User');
const Reviewer = require('../models/Reviewer');
const ensureAuth = require('../utils/ensure-auth');
const tokenService = require('../utils/token-service');

router
    .get('/verify', ensureAuth(), (req, res) => {
        res.json({verified: true});
    })
    .post('/signup', respond(async ({body: data}) => {

        const {name, company, email, password, roles} = data;
        delete data.password;

        if(!password) throw {code: 400, error: 'missing password'};
        if(await User.emailExists(email)) throw { code: 400, error: 'email already exists'};

        const reviewer = await new Reviewer({name, company}).save();
        let userData = {_id: reviewer._id, email};
        if(roles) userData.roles = roles;
        const user = await new User(userData);
        user.generateHash(password);
        await user.save();

        return await tokenService.sign(user);
    }))
    .post('/signin', respond(async ({body: credentials}) => {

        const {email, password} = credentials;
        delete credentials.password;

        if(!password) throw {code: 400, error: 'password is required'};

        const user = await User.findOne({email});
        if(user && user.comparePassword(password)) return await tokenService.sign(user);
        else throw {code: 400, error: 'invalid email or password'};
    }))
;