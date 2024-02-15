const Movie = require('../models/movie');
const { cloudinary } = require('../cloudinary');


module.exports.index = async(req,res)=>{
    const movies = await Movie.find({}).populate('author');
    res.render('movies/index', { movies });
}

module.exports.renderNewForm = (req,res)=>{
    res.render('movies/new');
}

module.exports.createMovie = async(req,res,next)=>{
    const movie = new Movie(req.body.movie);
    movie.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    movie.author = req.user._id;
    await movie.save();
    // console.log(movie);
    req.flash('success', 'Successfully created a new movie!');
    res.redirect(`/movies/${movie._id}`);
}

module.exports.showMovie = async(req,res)=>{
    const movie = await Movie.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(movie);
    if(!movie){
        req.flash('error', 'Cannot find that movie!');
        return res.redirect('/movies');
    }
    res.render('movies/show', { movie });
}

module.exports.renderEditForm = async(req,res)=>{
    const { id } = req.params; 
    const movie = await Movie.findById(id).populate('author');
    if(!movie){
        req.flash('error', 'Cannot find that movie!');
        return res.redirect('/movies');
    }
    res.render('movies/edit', { movie }); 
}  

module.exports.updateMovie = async(req,res)=>{
    const { id } = req.params;
    // console.log(req.body);
    const movie = await Movie.findByIdAndUpdate(id, {...req.body.movie});
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    movie.images.push(...imgs);
    await movie.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await movie.updateOne({$pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', 'Successfully updated movie!');
    res.redirect(`/movies/${movie._id}`);
}

module.exports.deleteMovie = async(req,res)=>{
    const { id } = req.params; 
    await Movie.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a movie!');
    res.redirect('/movies');
}