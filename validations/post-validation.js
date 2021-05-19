const Joi       = require('Joi');

const Post = require('../models').posts;
const APIError = require('../utilities/APIError');


exports.create = {
    body : Joi.object({
        title       : Joi.string().min(3).max(250).trim().required(),
        content     : Joi.string().min(3).max(550).trim().required()
    })
}

exports.findOne = {
    params : Joi.object({
        id : Joi.number().required()
    })
}

exports.update = {
    params : Joi.object({
        id : Joi.number().required()
    }),
    body : Joi.object({
        title       : Joi.string().min(3).max(250).trim(),
        content     : Joi.string().min(3).max(550).trim()
    }).required().not({})
}

exports.remove = {
    params : Joi.object({
        id : Joi.number().required()
    })
}

exports.isExists = async (req, res, next) => {
    try {
        const id  = req.params.id;
        const post = await Post.findOne({ where : { id } });
        if (!post) throw new APIError({status : 404, message : "No Record were found for given Id" }); 
        next(); 
    } catch (error) {
        next(error);
    } 
}