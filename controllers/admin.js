const User = require('../models/user');
const Movie = require('../models/movie');
const Review = require('../models/review');

module.exports.getAllUsers = async(req,res)=>{
    const users = await User.find();
    res.render('admins/user', { users });
}

module.exports.getAllMovies = async(req,res)=>{
    const movies = await Movie.find().populate('author');
    res.render('admins/movie', { movies });
}

module.exports.getAllReviews = async(req,res)=>{
    const reviews = await Review.find();
    const movies = await Movie.find().populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    res.render('admins/review', { movies, reviews });
}

module.exports.deleteUser = async(req,res)=>{
    const { id } = req.params; 
    await User.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a user!');
    res.redirect('/admin/users');
}

module.exports.deleteMovie = async(req,res)=>{
    const { id } = req.params; 
    await Movie.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a movie!');
    res.redirect('/admin/movies');
}

module.exports.deleteReview = async(req,res)=>{
    const {id, reviewId} = req.params;
    await Movie.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect('/admin/reviews');
}
 