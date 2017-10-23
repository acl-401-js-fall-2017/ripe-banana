// const request = require('./request');
// const mongoose = require('mongoose');
// const assert = require('chai').assert;

// describe('Reviews API', () => {

//     beforeEach(() => mongoose.connection.dropDatabase());

//     let review1 = {
//         rating: 3,
//         reviewer: testReviewer1._id,
//         review_text: 'Great movie!!', 
//         film: testFilm1._id
//     };
    

//     let testFilm1 = {
//         title: 'Popeye',
//         studio: null,
//         released: 1951,
//         cast: [{
//             part: 'Popeye',
//             actor: null
//         }]
//     };

//     let testReviewer1 = {
//         name: 'Roger Ebert',
//         company: 'Siskel & Ebert'
//     };
   
//     function saveReviewer(reviewer) {
//         return request.post('/api/filmIndustry/reviewers')
//             .send(reviewer)
//             .then(({ body }) => {
//                 reviewer._id = body._id;
//                 return body;
//             });
//     }

    
//     function saveFilm(film) {
//         return request.post('/api/filmIndustry/films')
//             .send(film)
//             .then(({ body }) => {
//                 film._id = body._id;
//                 return body;
//             });
//     }


//     before(() => {
//         saveReviewer(testReviewer1);
//         saveFilm(testFilm1);  
//     });
        

//     it('saves a review', () => {
//         return request.post('/api/filmIndustry/reviews')
//             .send(review1)
//             .then(({ body }) => {
//                 assert.equal(body.rating, review1.rating); 
//             });
//     });

//     it('gets review with id', () => {
//         let savedReview = null;
//         return request.post('/api/filmIndustry/reviews')
//             .send(review1)
//             .then(res => {
//                 savedReview = res.body;
//                 return request.get(`/api/filmIndustry/reviews/${savedReview._id}`);
//             })
//             .then(res => {
//                 assert.equal(res.body.review_text, savedReview.review_text);
//             });
//     });


// });