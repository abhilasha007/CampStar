const Joi = require('joi');

module.exports.campgroundSchemaJoi = Joi.object({
    title : Joi.string().required(),
    price : Joi.number().required().min(0),
    location : Joi.string().required(),
    description : Joi.string().required(),
    deleteImages : Joi.array()
})

module.exports.reviewSchemaJoi = Joi.object({
    review : Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})