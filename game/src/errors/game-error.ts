import { CustomError } from "@summerinfo/common";

export enum gameErrors {
    ALREADY_FINISHED = 'Today\'s game is already finished.',
    ALREADY_USED = 'Vocabulary is already used.',
    NO_TIMER = 'Timer does not existed.',
    NOT_START = 'The game is not started yet.',
    OUT_OF_VOCAB = 'Database ran out of vocabulary.',
    UN_USEABLE = 'Vocabulary can not be used to connect.',
    USER_NOT_FOUND = 'No user data.',
    VOCAB_NOT_FOUND = 'Vocabulary is not in database.',
}

export class GameError extends CustomError {
    statusCode: number;
    message: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;

        Object.setPrototypeOf(this, GameError);
    }

    serializeErrors() {
        return [ { message: this.message } ];
    }

}
