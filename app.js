const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');

const app = express();

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home');
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

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