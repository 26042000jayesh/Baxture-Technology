const CustomErrorHandler = require('../services/CustomErrorHandler');
const joi=require("joi");

const errorHandler = (err, req, res, next) => {
    //defailt error response
    let statusCode = 500;
    let data = {
        message: err.message
    }

    if (err instanceof joi.ValidationError) {
        statusCode = 400;
        data = {
            message: err.message
        }
    }

    if (err instanceof CustomErrorHandler) {
        statusCode = err.status;
        data = {
            message: err.message
        }
    }
    
    return res.status(statusCode).json(data);
}

module.exports = errorHandler;