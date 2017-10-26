const router = module.exports = require('express').Router();
const respond = require('../utils/respond');
const User = require('../models/User');
const Reviewer = require('../models/Reviewer');
const tokenService = require('../utils/token-service');

router
    .post('/signup', respond(async ({body: data}, res, next) => {

        if(!data.password) throw {code: 400, error: 'missing password'};

        const {name, company, email, password} = data;
        delete data.password;
        
        const reviewer = await new Reviewer({name, company}).save()
        const user = await new User({
            _id: reviewer._id,
            email
        });
        user.generateHash(password);
        await user.save();
        return await tokenService.sign(user);
    }));