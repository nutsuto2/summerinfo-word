"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotAuthenticatedError = void 0;
const custom_error_1 = require("./custom-error");
class NotAuthenticatedError extends custom_error_1.CustomError {
    constructor() {
        super('User is not signed in.');
        this.statusCode = 401;
        Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
    }
    serializeErrors() {
        return [{ message: 'User is not signed in.' }];
    }
}
exports.NotAuthenticatedError = NotAuthenticatedError;
