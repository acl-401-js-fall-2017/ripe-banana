const chai = require('chai');
const chaitHttp = require('chai-http');
chai.use(chaitHttp);
const http = require('http');
const app = require('../../lib/app');

const server = http.createServer(app);
const request = chai.request(server);

after(() => server.close());

module.exports = request;