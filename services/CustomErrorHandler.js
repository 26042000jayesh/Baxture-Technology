
class CustomErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static routeNotMatched (message) {
        return new CustomErrorHandler(404, message);
    }

    static validationFailed(message = 'Invalid UserId') {
        return new CustomErrorHandler(400, message);
    }

    //handling requested resourse not found error
    static notFound(message = '404 Not Found') {
        return new CustomErrorHandler(404, message);
    }

    //handling server errors
    static serverError(message = 'Internal server error') {
        return new CustomErrorHandler(500, message);
    }
}

module.exports= CustomErrorHandler;