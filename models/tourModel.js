import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A tour must have a name'],
			unique: true,
			min: [5, 'Name should have at least 5 characters'],
			max: [20, 'Name should have at most 20 characters'],
		},
		price: {
			type: Number,
			required: [true, 'A tour must have a price'],
		},
		rating: Number,
		min: [1, 'Rating should at least 1'],
		max: [5, 'Rating cannot be more than 5'],

		summary: {
			type: String,
			// trim: true,
			required: [true, 'A tour must have a summary'],
		},
		drink: {
			type: String,
			value: ['coffee', 'tea'],
			message: '{value} is not supported',
		},
		slug: String,
	},
	{ timestamps: true },
);
//document middleware
//before save (.save()  , .create())
tourSchema.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
});
// after the document is saved to the database
tourSchema.post('save', function (doc, next) {
	console.log('Post save hook ran successfully');
	// 	next();)
});

// QUERY MIDDLEWARE
//   tourSchema.pre(find,function(){})
tourSchema.pre(/^find/, function (next) {
	this.find({ privateTour: { $ne: true } });
	//12:00:12
	this.start = Date.now();
	// next();)
});

tourSchema.post(/^find/, function (docs, next) {
	// 12:00:15
	console.log(`Query took ${Date.now() - this.start} milliseconds`);
	next();
});
const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
