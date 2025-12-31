import AppError from '../utils/appError.js';

const handlECastErrorDB = (err) => {
	const message = `Invalid ${err.path}:  ${err.value}`;
	return new AppError(message, 400);
};
const handleDuplicateErrorDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;

	return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((item) => item.message);
	const message = `Invalid input data ${errors.join(', ')}`;

	return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
const sendErrorProd = (err, res) => {
	//Operation errors
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error('Error in prod', err);
		res.status(500).json({
			status: 'error',
			message: 'Something went very very wrong!',
		});
	}
};

export default (err, req, res, next) => {
	console.log('Global error handling middleware');
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else {
		let error = { ...err };
		if (error.name === 'CastError') {
			//format based
			error = handlECastErrorDB(error);
		}
		if (error.code === 11000) {
			error = handleDuplicateErrorDB(error);
		}
		if (error.name === 'ValidatorError') {
			error = handleValidationErrorDB(error);
		}
	}

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
	});
};
