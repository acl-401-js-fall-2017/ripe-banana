const request = require('./request');
const { assert } = require('chai');
const db = require('./db');

// describe.skip('Auth API', () => {
//     beforeEach(db.drop);

//     let token = null;

//     beforeEach(() => {
//         return request.post('/api/auth/signup')
//             .send({
//                 email: 'user@gmail.com',
//                 password: 'secret',
//                 name: 'Chris',
//                 company: 'Alchemy'
//             })
//             .then(({ body }) => token = body.token);
//     });

//     it.skip('signup', () => {
//         assert.ok(token);
//     });
// });