const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Handling uncaught exception. Ie. console.log(x) x not defined
process.on('uncaughtException', err => {
    console.log(err);
    process.exit(1);
});

dotenv.config({ path: './config.env' }); // config environtment variables
const app = require('./app');
//console.log(process.env); // return the environment in which node is running

const DB = process.env.DATABASE.replace(    // Connect database
    '<PASSWORD>', 
    process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {        // Return a promise
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connection successful'));

// const testTour = new Tour({
//     name: 'The Park Camper',
//     price: 997
// });
// testTour.save().then(doc => {
//     console.log(doc);
// }).catch(err => console.log('Error 💩:', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App listening to port ${port}`);
});

// Handling unhandled exceptions . Ie. database password is wrong
process.on('unhandledRejection', err => {
    console.log(err.name, err.message);
    server.close(() =>{
        process.exit(1);
    })
});
