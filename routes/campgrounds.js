const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware');

// Create
router.post('/', isLoggedIn, validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body);
    campground.author = req.user._id;
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
    const camp = await Campground.findById(id).populate({path:'reviews', populate:'author'}).populate('author');
    if(!camp) {
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {camp});
}))

// Update
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp) {
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body});
    req.flash('success', 'Successfully Updated the campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}))

//Delete
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req, res) => {
    const { id }= req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}))

module.exports = router;