const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers'); 
const Movie = require('../models/movie');

mongoose.connect('mongodb://127.0.0.1:27017/movie-review');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async()=>{
    await Movie.deleteMany({});
    for(let i=0; i<50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Movie({
            author: '65a0376f7da03fa5f8538bb7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur repudiandae quam perspiciatis omnis doloribus autem, excepturi beatae esse, molestias modi repellat et, expedita dicta eaque ratione ut natus suscipit illum?',
            price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dbfdgachs/image/upload/v1705253821/FilmFiesta/jvm7nbtfekogbd0uliuf.jpg',
                  filename: 'FilmFiesta/jvm7nbtfekogbd0uliuf'
                },
                {
                  url: 'https://res.cloudinary.com/dbfdgachs/image/upload/v1705253822/FilmFiesta/hoykw14bl9ua58xbatvk.jpg',
                  filename: 'FilmFiesta/hoykw14bl9ua58xbatvk'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})