import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
    statusCode = 401;


    constructor() {
        super('User is not signed in.');

        Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
    }

    serializeErrors() {
        return [{ message: 'User is not signed in.' }];
    }
}
