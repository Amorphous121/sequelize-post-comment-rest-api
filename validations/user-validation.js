const Joi       = require('Joi');

const User = require('../models').users;
const APIError = require('../utilities/APIError');

exports.create = {
    body : Joi.object({
        first_name  : Joi.string().min(3).max(20).trim().required(),
        last_name   :Joi.string().min(3).max(20).trim().required(),
        email       : Joi.string().email().min(3).max(50).trim().required().lowercase(),
        password    : Joi.string().min(4).max(10).trim().required() 
    })
}

exports.login = {
    body : Joi.object({
        email       : Joi.string().email().min(3).max(50).trim().required().lowercase(),
        password    : Joi.string().min(4).max(10).trim().required() 
    })
}

exports.update = {
    params : Joi.object({
        id : Joi.number().required(),
    }),
    body : Joi.object({
        first_name  : Joi.string().min(3).max(20).trim(),
        last_name   :Joi.string().min(3).max(20).trim(),
        email       : Joi.string().email().min(3).max(50).trim().lowercase(),
        password    : Joi.string().min(4).max(10).trim()
    }).required().not({})
}

exports.remove = {
    params : Joi.object({
        id : Joi.number().required()
    })
}

exports.findOne = {
    params : Joi.object({
        id : Joi.number().required()
    })
}

exports.isExists = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await User.findOne({ where : { id }});
        if  (!user) throw new APIError({status : 404, message : "No such user found with given id. " });
        next();
    } catch (error) {
        next(error)
    }
}