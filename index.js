const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const {campgroundSchemaJoi} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');

const app = express();

mongoose.connect('mongodb://localhost:27017/campstar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected!');
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'));
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
})

// Joi validation
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
app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);    
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// Read
app.get('/campgrounds', catchAsync(async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', {camps});
}))

app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/show', {camp});
}))

// Update
app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/edit', {camp});
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/campgrounds/${camp._id}`);
}))

//Delete
app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id }= req.params;
    const camp = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.all('*', (req, res) => {
    throw new ExpressError('Page Not Found!', 404);
})

app.use((err, req, res, next) => {
    const {statusCode=500, message='Something Went Wrong!'} = err;
    res.status(statusCode).render('error', {err});
})

app.listen(3000, (req, res) => {
    console.log('Server started at port 3000');
})