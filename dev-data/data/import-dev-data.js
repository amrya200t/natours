const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

require('dotenv').config({ path: `${__dirname}/../../config.env` });

console.log(process.env.DATABASE_URL);
const DB_URL = process.env.DATABASE_URL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// eslint-disable-next-line no-console
mongoose.connect(DB_URL).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

// IMPORT DATA TO DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data successfully loaded!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL DATA FROM DATABASE
const deleteDate = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data successfully Deleted!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteDate();
}
