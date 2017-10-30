const jwt = require('jsonwebtoken');
const appSecret = process.env.APP_SECRET || 'changeIt!!!';

module.exports = {
    sign(user) {
        return new Promise((resolve, reject) => {
            const payload = {
                id:user._id
            };

            jwt.sign(payload, appSecret, (err, token) => {
                if(err) reject(err);
                else resolve(token);
            });
        });
    }

    
};