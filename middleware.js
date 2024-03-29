const {movieSchema, reviewSchema} = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const Movie = require('./models/movie');
const Review = require('./models/review');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateMovie = (req,res,next)=>{
    
    const {error} = movieSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}

module.exports.isUserAdmin = async(req,res,next)=>{
    const { id } = req.params;
    if(!req.user.isAdmin){
        req.flash('error', "You are not an admin!");
        return res.redirect(`/movies`);
    }
    next();
}

module.exports.isAuthorOrAdmin = async(req,res,next)=>{
    const { id } = req.params; 
    const movie = await Movie.findById(id);
    if((movie.author.equals(req.user._id)) || (req.user.isAdmin)){
        // req.flash('error', "You don't have permission to do that!");
        // return res.redirect(`/movies/${id}`);
        next();
    }
    else{
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/movies/${id}`);
    }        
}

module.exports.isReviewAuthorOrAdmin = async(req,res,next)=>{
    const { id, reviewId } = req.params; 
    const review = await Review.findById(reviewId);
    if((review.author.equals(req.user._id)) || (req.user.isAdmin)){
        // req.flash('error', "You don't have permission to do that!");
        // return res.redirect(`/movies/${id}`);
        next();
    }
    else{
        req.flash('error', "You don't have permission to do that!");
        return res.redirect(`/movies/${id}`);
    } 
}

module.exports.validateReview = (req,res,next)=>{
    
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}