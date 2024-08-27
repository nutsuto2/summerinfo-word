import { CustomError } from "./custom-error";

export class AuthenticationError extends CustomError {
    statusCode = 401;

    constructor() {
        super('Username or Password is incorrect! Try again.');

        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Username or Password is incorrect! Try again.' }];
    }
}
