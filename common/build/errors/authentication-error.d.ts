import { CustomError } from "./custom-error";
export declare class AuthenticationError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
