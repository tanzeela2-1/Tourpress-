import mongoose from 'mongoose';
import './configs/config.js';
import app from './app.js';

console.log(process.env.NODE_ENV);

//const DB_URL = 'mongodb+srv://sofitanu0786_db_user:jY7jV75mVN05Se7n@cluster0.t9kjnsf.mongodb.net/?appName=Cluster0';
mongoose
	.connect(process.env.DB_URL)
	.then(() => {
		console.log('Database connected successfully✅');
	})
	.catch((err) => {
		console.log('Database connection failed 🔥', err);
	});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
