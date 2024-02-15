const express = require('express');
const router = express.Router();
const admin = require( '../controllers/admin');
const {isLoggedIn, isUserAdmin} = require('../middleware.js');
const catchAsync = require('../utils/catchAsync');


router.route('/users').get(isLoggedIn, isUserAdmin, catchAsync(admin.getAllUsers));

router.route('/movies').get(isLoggedIn, isUserAdmin, catchAsync(admin.getAllMovies));

router.route('/reviews').get(isLoggedIn, isUserAdmin, catchAsync(admin.getAllReviews));


router.route('/user/:id').delete(isLoggedIn, isUserAdmin, catchAsync(admin.deleteUser));

router.route('/movie/:id').delete(isLoggedIn, isUserAdmin, catchAsync(admin.deleteMovie));

router.route('/review/:reviewId').delete(isLoggedIn, isUserAdmin, catchAsync(admin.deleteReview));

module.exports = router;