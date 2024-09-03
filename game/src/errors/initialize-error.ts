import { CustomError } from "@summerinfo/common";

export class InitializeError extends CustomError {
    statusCode = 500;
    message: string;

    constructor(message: string) {
        super(message);
        this.message = message;

        Object.setPrototypeOf(this, InitializeError.prototype);
    }

    serializeErrors(): { message: string; field?: string; }[] {
        return [{ message: this.message }];
    }
}
