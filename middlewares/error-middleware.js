const { ValidationError } = require('express-validation')
const APIError = require('../utilities/APIError');
const chalk = require('chalk')

const getErrorMessage = error => {
    error = error.details;
    if (error.params)   return error.params[0].message;
    if (error.body)     return error.body[0].message;
    if (error.query)    return error.query[0].message;
}


exports.handler = (err, req, res, next) => {
    let message = err.message || "Something went wrong! Please try again later.";
    if (!err.isPublic) {
        err.status = 500;
        message = "Something went wrong! Please try again later.";
    }
    if (process.env.NODE_ENV === 'development') {
        console.log(chalk.bgRedBright.bold("\n\t ", err.message, " "));
        if (err.stack) console.log(err.stack);
        if (err.errors) console.log(err.errors);
    }
    return res.sendJson(err.status, message);
}

exports.converter = (err, req, res, next) => {
    
    let convertedErr = err;
    if (err instanceof ValidationError) 
        convertedErr = new APIError({ status : 422, message : getErrorMessage(err)});
    else if (!(err instanceof APIError)) 
        convertedErr = new APIError({ status : err.status, message : err.message, stack : err.stack})
    return this.handler(convertedErr, req, res);
}

exports.notFound = (req, res, next) => {
    const err = new APIError({ stack : 404, message : "Page not found!!"});
    return this.handler(err, req, res);
}