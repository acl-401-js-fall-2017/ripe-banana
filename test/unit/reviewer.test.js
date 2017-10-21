// const assert = require('chai').assert;
// const Reviewer = require('../../lib/models/reviewer');

// describe('Reviewer model', () => {
    
//     it('check if good model', () => {
//         const reviewer = new Reviewer({
//             name: 'Roger Ebert',
//             company: 'Siskel & Ebert'
//         });
//         assert.equal(reviewer.validateSync(), undefined);
//     });

//     it('check required fields', () => {
//         const reviewer = new Reviewer ({
//             name: 'Roger Ebert'
//         });
//         const { errors } = reviewer.validateSync();
//         assert.equal(errors.company.kind, 'required');
//     });

// });