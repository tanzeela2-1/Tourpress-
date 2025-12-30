import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';

export default function tourController() {
	return {
		// Get all tours
		getAllTours: catchAsync(async (req, res, next) => {
			const queryObj = { ...req.query };

			const excludeFields = ['page', 'sort', 'limit', 'field'];
			excludeFields.forEach((el) => delete queryObj[el]);

			let queryStr = JSON.stringify(queryObj);
			queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

			let query = Tour.find(JSON.parse(queryStr)).sort('name rating');
			if (req.query.sort) {
				const sortBy = req.query.sort.split(',').join(' ');

				query = query.sort(sortBy);
			} else {
				query = query.sort('-createdAt');
			}
			if (req.query.field) {
				const limitFields = req.query.field.split(',').join(' ');
				console.log(limitFields);
				query = query.select(limitFields);
			} else {
				query = query.select('-__v');
			}
			const page = req.query.page * 1 || 1;
			const limit = req.query.limit * 1 || 10;
			const skip = (page - 1) * limit;
			query = query.skip(skip).limit(limit);

			const tours = await query;

			const total = await Tour.countDocuments();

			res.status(200).json({
				status: 'success', //success or fail or error
				results: tours.length,
				total,
				data: {
					tours,
				},
			});
		}),
		// Create a tour
		createTour: catchAsync(async (req, res, next) => {
			const { name, price, rating, summary, duration } = req.body;

			const newTour = await Tour.create({ name, price, rating, summary, duration });

			res.status(201).json({
				status: 'success',
				data: {
					tour: newTour,
				},
			});
		}),
		// Get a tour
		getTour: catchAsync(async (req, res, next) => {
			const id = req.params.id;

			const tour = await Tour.findById(id);

			if (!tour) {
				// return res.status(404).json({
				// 	status: 'fail',
				// 	message: 'The tour id does not exist',
				// });
				return next(new AppError('The tour id does not exit', 404));
			}

			res.status(200).json({
				status: 'success',
				data: {
					tour,
				},
			});
		}),
		// Update a tour
		updateTour: catchAsync(async (req, res, next) => {
			const id = req.params.id;

			const { name } = req.body;

			if (!name) {
				// res.status(400).json({
				// 	status: 'fail',
				// 	message: 'Please provide a name',
				// });
				return next(new AppError('The tour id does not exit', 404));
			}

			const tour = await Tour.findByIdAndUpdate(
				id,
				{
					name,
				},
				{
					new: true,
				},
			);

			res.status(200).json({
				status: 'success',
				data: {
					tour,
				},
			});
		}),
		deleteTour: catchAsync(async (req, res, next) => {
			const id = req.params.id;

			const tourExists = await Tour.findById(id);

			if (!tourExists) {
				// return res.status(404).json({
				// 	status: 'fail',
				// 	message: 'The tour id does not exist',
				// });
				return next(new AppError('The tour id does not exit', 404));
			}

			const tour = await Tour.deleteOne({ _id: id });

			res.status(204).json({
				status: 'success',
				data: {
					tour,
				},
			});
		}),
	};
}
