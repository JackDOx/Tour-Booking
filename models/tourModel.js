const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
  name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name muse have fewer or qeual 40 chars'],
      minlength: [10, 'A tour name must have more or equal 10 chars']
      // validate: [validator.isAlpha, 'Tour name must only contain chars'] // use of validator
    },
  slug: String,

  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    require: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either easy medium or difficult'
    }
  },
  ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating muse be lower 5.0'],
      // set is run whenever this model is used. this function is to round the average
      set: val => Math.round(val * 10) / 10 // 4.666 -> 46.66 -> 47 -> 4.7
  },
  ratingQuantity: {
    type: Number,
    default: 0
  },
  price: {
      type: Number,
      required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val){
        // This points to new input, not update the existed data
      return val < this.price; // false trigger validation error
    },
    message: 'Discoutn price ({VALUE}) shoule be below regular price'
    } // ({VALUE}) accesses the input value for validator
  },
  summary: {
    type: String,
    trim: true, //remove white space at beginning and the end of the String
    required: [true, 'A tour must have a price']
},
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String], // an array of strings - many images
  createdAt: {
    type: Date, // built-in data type - 2021-04-12 or 12:30
    default: Date.now(),
    select: false
  },
  startDates: [Date],
  secretTour: {
    type: Boolean,
    default: false
  },
  startLocation: {
    // GeoJSOn 
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: [Number],  // An Array of Number
    address: String,
    description: String
  },
  locations: [
    {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String,
      description: String,
      day: Number
    }
  ],
  // guides: Array // embedding method
  guides: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User' // dont need to import User model
  }
  ]
},  
  
{
    toJSON: { virtuals: true},
    toObject: {virtuals: true}
  }
);

// 1 mean sorted in ascending order, -1 vice versa
tourSchema.index({ price: 1, ratingsAverage: -1});
tourSchema.index({ slug: 1});
tourSchema.index({ startLocation: '2dshpere'}); // startLocation should be in 2dshpere
//  Virtual property
tourSchema.virtual('durationWeeks').get(function() { // normal function() to access this keyword
  return this.duration / 7; // calculating another data for documents
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // the field in Review that holds the reference to the current model
  localField: '_id' // the name of the field in the current model correspond to the foreign field

});


//  DOCUMENT MIDDLEWARE: only runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, {  lower: true });
  next();
});


    // EMBEDDING USERS into TOUR
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => User.findById(id));
//   // return an array full of promises so we need to use Promise.all()
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

    // PRE POST
// tourSchema.post('save', function(doc, next) {
//   // console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE:
tourSchema.pre(/^find/, function(next) { //'find' point at the current query
  this.find({ secretTour: {$ne: true}}); //regex /^find/ definds all methods have word find will apply this
  
  this.start = Date.now(); // setting new element called start
  next();
});

// POPULATING guide fields with actual DATA
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

// tourSchema.post(/^find/, function(docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGRATION MIDDLEWARE
// tourSchema.pre(('aggregate'), function(next) {
//   // this points to current aggregation object
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true}}});

//   next();
// });
const Tour = mongoose.model('Tour', tourSchema); // Always use upper case on model name and var
// 'Tour' corresponds to tours in MongoDB - name of collection
module.exports = Tour;
