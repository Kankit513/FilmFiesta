const Joi = require('joi');

module.exports.movieSchema = Joi.object({
    movie: Joi.object({
        title: Joi.string().required(),
        imdb_rating: Joi.string().required(),
        budget: Joi.number().required().min(0),
        box_office_collection: Joi.number().required().min(0),
        director: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})