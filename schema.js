const Joi = require("joi");

const listingSchema = Joi.object({
        listing: Joi.object({
        title: Joi.string().trim().pattern(/[A-Za-z]/).required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        image: Joi.object({
            url: Joi.string().allow("", null),
        }),
    }).required(),
    });

    module.exports = listingSchema;
