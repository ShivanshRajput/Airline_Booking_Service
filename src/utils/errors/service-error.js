const { StatusCodes } = require('http-status-codes');

class ServiceError extends Error {
    constructor(
        message  = "something went wrong",
        explaination = 'Service Layer Error', 
        StatusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ){
        super(); 
        this.name = "ServiceError";
        this.message = message;
        this.explaination = explaination;
        this.StatusCode = StatusCode;
    }
}

module.exports = ServiceError;