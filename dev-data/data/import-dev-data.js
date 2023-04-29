const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './../../config.env' });
//console.log(process.env); // return the environment in which node is running

const DB = process.env.DATABASE.replace(
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {        // Return a promise
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful'));

const tours = JSON.parse(fs.readFileSync('tours.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
const reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('DB deleted all data');
  } catch (err) {
    console.log(err);
  };
  process.exit();
};
// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, {validateBeforeSave: false});
     // validator off because passwordconfirm is not included
    await Review.create(reviews);
    console.log('Data imported successfully');
  } catch (err) {
    console.log(err);
  };
  process.exit();
};

if(process.argv[2] === '--import'){
  importData();
} else if (process.argv[2] === '--delete'){
  deleteData();
};
console.log(process.argv);

//node import-dev-data.js --import
//node import-dev-data.js --delete 
// These 2 commands can be used anywhere to import and delete data