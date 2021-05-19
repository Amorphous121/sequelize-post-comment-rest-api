const Joi = require('Joi');

const Comment = require('../models').comments;
const APIError = require('../utilities/APIError');

exports.findOne = {
    params : Joi.object({
        id : Joi.number().required()
    })
}

exports.create = {
    body : Joi.object({
        postId    : Joi.number().required(),
        comment : Joi.string().min(3).max(150).required().trim() 
    })
}

exports.update = {
    params : Joi.object({
        id : Joi.number().required()
    }),
    body : Joi.object({
        comment : Joi.string().min(3).max(150).trim() 
    }).required().not({})
}

exports.remove = {
    params : Joi.object({
        id : Joi.number().required()
    })
}

exports.isExists = async (req, res, next) => {
    try {
        const id = req.params.id;
        const comment = await Comment.findByPk(id);
        if (!comment) throw new APIError({status : 404, message : "No comment were found with given id. "});
        next();
    } catch (error) {
        next(error)
    }
}