const Campground = require('../models/campground');

// Create
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res, next) => {
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);    
}

// Read
module.exports.showCampground = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({path:'reviews', populate:'author'}).populate('author');
    if(!camp) {
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {camp});
}

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}

// Update
module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp) {
        req.flash('error', 'Cannot find the campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {camp});
}

module.exports.editCampground = async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body});
    req.flash('success', 'Successfully Updated the campground!');
    res.redirect(`/campgrounds/${camp._id}`);
}

// Delete
module.exports.deleteCampground = async(req, res) => {
    const { id }= req.params;
    const camp = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}