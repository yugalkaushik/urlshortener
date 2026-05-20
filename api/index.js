const serverless = require('serverless-http');
const app = require('../dist/app').default || require('../dist/app');
const { connectDB } = require('../dist/config/db');

const handler = serverless(app);

let dbReady = false;

module.exports = async (req, res) => {
	const start = Date.now();
	console.log('Lambda invoked:', req.method, req.url);

	if (!dbReady) {
		console.log('DB not ready, connecting...');
		try {
			await connectDB();
			dbReady = true;
			console.log('DB connected in lambda');
		} catch (err) {
			console.error('DB connection error in serverless handler:', err);
			res.statusCode = 500;
			return res.end('Database connection error');
		}
	}

	let result;
	try {
		result = handler(req, res);
		// handler may return a promise
		if (result && typeof result.then === 'function') {
			await result;
		}
	} catch (err) {
		console.error('Handler threw:', err);
		throw err;
	} finally {
		console.log('Lambda finished:', req.method, req.url, 'durationMs=', Date.now() - start);
	}

	return;
};
