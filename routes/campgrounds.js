const express = require('express');
const router = express.Router();
const {campgroundSchemaJoi} = require('../schemas.js');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn} = require('../middleware');

const validateCampground = (req, res, next) => {
    const result = campgroundSchemaJoi.validate(req.body);
    if(result.error) {
        const msgs = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msgs, 400);
    }
    else {
        next();
    }
}

// Create
router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);    
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// Read
router.get('/', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}))

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate('reviews');
    if(!camp) {
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {camp});
}))

// Update
router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp) {
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body});
    req.flash('success', 'Successfully Updated the campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}))

//Delete
router.delete('/:id', isLoggedIn, catchAsync(async(req, res) => {
    const { id }= req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;