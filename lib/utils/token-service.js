const jwt = require('jsonwebtoken');
const appSecret = process.env.APP_SECRET || 'SuperSecret';

module.exports = {
    sign(reviewer) {
        return new Promise((resolve, reject) => {
            const payload ={
                id: reviewer._id,
                roles:reviewer.roles
            };

            jwt.sign(payload, appSecret, (err, token) => {
                if(err) reject(err);
                else resolve(token);
            });
        });
    },

    verify(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, appSecret, (err, payload) => {
                if(err) reject(err);
                else resolve(payload);
            });
        });
    }

};