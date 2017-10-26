const router = module.exports = require('express').Router();
const respond = require('../utils/respond');
const User = require('../models/User');
const tokenService = require('../utils/token-service');

router
    .post('/signup', respond(async ({body: data}, res, next) => {

        const {name, company, email, password} = data;
        delete data.password;

        const user = new User({email});
        user.generateHash(password);
        await user.save();
        return await tokenService.sign(user);
    }));