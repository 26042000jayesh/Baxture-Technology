const CustomErrorHandler = require("../services/CustomErrorHandler")

const errorHandler = (err, req, res, next) => {
    //defailt error response
    let statusCode = err.status;;
    let data = {
        message: err.message
    }

    return res.status(statusCode).json(data);
}

module.exports = errorHandler;