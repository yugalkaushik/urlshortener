const serverless = require('serverless-http');
const app = require('../dist/app').default || require('../dist/app');
const { connectDB } = require('../dist/config/db');

const handler = serverless(app);

let dbReady = false;

module.exports = async (req, res) => {
	if (!dbReady) {
		try {
			await connectDB();
			dbReady = true;
		} catch (err) {
			console.error('DB connection error in serverless handler:', err);
			res.statusCode = 500;
			return res.end('Database connection error');
		}
	}

	return handler(req, res);
};
