import { CustomError } from "./custom-error";
export declare class NotAuthenticatedError extends CustomError {
    statusCode: number;
    constructor();
    serializeErrors(): {
        message: string;
    }[];
}
