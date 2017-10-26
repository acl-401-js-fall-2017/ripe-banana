const router = module.exports = require('express').Router();
const respond = require('../utils/respond');
const User = require('../models/User');
const Reviewer = require('../models/Reviewer');
const tokenService = require('../utils/token-service');

router
    .post('/signup', respond(async ({body: data}, res, next) => {

        const {name, company, email, password} = data;
        delete data.password;

        if(!password) throw {code: 400, error: 'missing password'};
        if(await User.emailExists(email)) throw { code: 400, error: 'email already exists'};

        const reviewer = await new Reviewer({name, company}).save();

        const user = await new User({
            _id: reviewer._id,
            email
        });
        user.generateHash(password);
        await user.save();

        return await tokenService.sign(user);
    }));