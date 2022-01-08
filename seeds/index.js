const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelper');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/campstar', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log('Database connected!');
})

const sample = (arr) => {
    return arr[Math.floor(Math.random()*arr.length)];
}

const seedDB = async() => {
    await Campground.deleteMany({});
    
    for(let i=0; i<50; ++i) {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20) + 10;
        const camp = new Campground({
            author: '61ce4155a20932346de06000',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero quasi mollitia praesentium? Veritatis sit earum animi inventore hic corporis officia. Expedita in debitis sit voluptatibus ad asperiores placeat, maxime eveniet!',
            price: price,
            geometry: {
                type: "Point",
                coordinates: [78.055, 30.4571]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/df8hyjwp9/image/upload/v1641443187/CampStar/vrl5ltiwhwz7rs90cuo1.jpg',
                  filename: 'CampStar/vrl5ltiwhwz7rs90cuo1',
                },
                {
                  url: 'https://res.cloudinary.com/df8hyjwp9/image/upload/v1641443186/CampStar/w2j2ugmz8pz5entgdqrt.jpg',
                  filename: 'CampStar/w2j2ugmz8pz5entgdqrt',
                },
            ],
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})