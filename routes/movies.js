const express = require('express');
const router = express.Router();
const {isLoggedIn, isAuthorOrAdmin, validateMovie} = require('../middleware.js');
// const Movie = require('../models/movie');
const movies = require('../controllers/movies');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync(movies.index))
    .post(isLoggedIn, upload.array('image'), validateMovie, catchAsync(movies.createMovie));

router.get('/new', isLoggedIn, movies.renderNewForm);

router.route('/:id')
    .get(catchAsync(movies.showMovie))
    .put(isLoggedIn, isAuthorOrAdmin, upload.array('image'), validateMovie, catchAsync(movies.updateMovie))
    .delete(isLoggedIn, isAuthorOrAdmin, catchAsync(movies.deleteMovie));

router.get('/:id/edit', isLoggedIn, isAuthorOrAdmin, catchAsync(movies.renderEditForm));

module.exports = router;
