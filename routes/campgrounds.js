const express = require('express');
const router = express.Router();

const {campgroundSchemaJoi} = require('../schemas.js');

const Campground = require('../models/campground');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


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
router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);    
}))

router.get('/new', (req, res) => {
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
    res.render('campgrounds/show', {camp});
}))

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', {camp});
}))

// Update
router.put('/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/campgrounds/${camp._id}`);
}))

//Delete
router.delete('/:id', catchAsync(async(req, res) => {
    const { id }= req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;