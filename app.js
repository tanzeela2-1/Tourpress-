import express from 'express';
import morgan from 'morgan';

import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

import AppError from './utils/appError.js';
import globalError from './controllers/errorController.js';

const app = express();

app.use(express.json());

console.log('process', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// app.get('/', (req, res) => {
// 	console.log(req.body);
// 	res.send('Hello World');
// });

// routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// unhandled routes
app.all('{/*path}', (req, res) => {
	// console.log(req.originalUrl);
	// res.status(404).json({
	// 	status: 'fail',
	// 	message: `Can't find${req.originalUrl} on this server`,
	// });
	// const err = new Error(`Can't find${req.originalUrl} on this server`);
	// err.statusCode = 404;
	// err.message = 'fail';
	next(new AppError(`Can't find${req.originalUrl} on this server`, 404));
});

// app.use((err, req, res, next) => {
// 	err.statusCode = err.statusCode || 500;
// 	err.status = err.status || 'error';

// 	res.status(err.statusCode).json({
// 		status: err.status,
// 		message: err.message,
// 	});
// });
app.use(globalError);
export default app;
