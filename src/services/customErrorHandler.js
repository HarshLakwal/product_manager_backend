class customErrorHandler extends Error {
    constructor(status, msg) {
        super();
        this.status = status;
        this.message = msg;
    }

    static invalidFormate(message) {
        return new customErrorHandler(422, message)
    }

    static alreadyExist(message) {
        return new customErrorHandler(409, message)
    }

    static unAuthorized(message = 'unAuthorized') {
        return new customErrorHandler(401, message)
    }

    static wrongCredentails(message = 'Email and password is wrong!') {
        return new customErrorHandler(404, message)
    }

    static notFound(message = 'user Not Found') {
        return new customErrorHandler(404, message)
    }
    static ServerError(message = 'Internal server Error') {
        return new customErrorHandler(500, message)
    }

}
export default customErrorHandler