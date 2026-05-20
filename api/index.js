const serverless = require('serverless-http');
const app = require('../dist/app').default || require('../dist/app');
module.exports = serverless(app);
