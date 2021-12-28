const express = require('express');
const router = express.Router({ mergeParams: true });

const {reviewSchemaJoi} = require('../schemas.js');

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


const validateReview = (req, res, next) => {
    const {error} = reviewSchemaJoi.validate(req.body);
    if(error) {
        const msgs = error.details.map(el => el.message).join(',');
        throw new ExpressError(msgs, 400); 
    }
    else {
        next();
    }
}

//create
router.post('/', validateReview, catchAsync(async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

//delete
router.delete('/:reviewId', catchAsync(async(req,res)=> {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, { $pull : {reviews : reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;