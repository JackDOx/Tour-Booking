const mongoose = require('mongoose');
const Tour = require('./tourModel');
const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty!']
  },
  rating: {
    type: Number,
    required: [true, 'A rating is required for a review'],
    min: [1, 'Rating must be above 1.0.'],
    max: [5, 'Rating must be below 5.0.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Review must belong to a tour.']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: [true, 'Review must belong to a user.']
  }

},
{
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
}
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });


// MIDDLEWARE
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});


// Calculating statistics for a tour after post a new Review for it
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  // This point to model so we can use aggregate()
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }  // match the Reviews with tour = tourId
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  // if there is only 1 review references to the tour, delete it means can't find
  // any reviews with that tourId so stats will be empty. In taht case, we set it to default.
  if (stats.length >0){
    await Tour.findByIdAndUpdate(tourId, {
      ratingQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId,{
      ratingQuantity: 0,
      ratingsAverage: 4.5
  });
  };
};

// post save does not access the next middleware
reviewSchema.post('save', function() {
  // this points to current review
  // this.constructor is Tour
  this.constructor.calcAverageRatings(this.tour);

});

// findByIdAndUpdate
// findByIdAndDelete  are findOneAnd... in the background
// middleware with find doesnot access the document but the query
reviewSchema.pre(/^findOneAnd/, async function(next) {
  // query is not executed so this.findOne() returns a Review
  this.r = await this.findOne();  // save the current Review to this.r
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});


const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;