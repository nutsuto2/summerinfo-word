"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationError = void 0;
const custom_error_1 = require("./custom-error");
class AuthenticationError extends custom_error_1.CustomError {
    constructor() {
        super('Username or Password is incorrect! Try again.');
        this.statusCode = 401;
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
    serializeErrors() {
        return [{ message: 'Username or Password is incorrect! Try again.' }];
    }
}
exports.AuthenticationError = AuthenticationError;
