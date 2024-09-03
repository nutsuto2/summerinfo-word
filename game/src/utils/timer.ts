import { GameError, gameErrors } from "../errors/game-error";
import { User } from "../models/user";
import { Game } from "./game";
import { calculateRewards } from "./reward";

export class UserTimer {
    username: string;
    startTime: Date;
    timeoutDuration = 1 * 60 * 1000;
    subtractDuration = 15 * 1000;
    timeout: any;

    constructor(username: string) {
        this.username = username;
        this.startTime = new Date();
        this.timeout = null;
        this.resetTimer(true);
        console.log(`Start a timer for ${this.username}`);
    }

    resetTimer(isReduce: boolean) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        const elaspedTime = new Date().getTime() - this.startTime.getTime();
        const remainingTime = isReduce ? Math.max(0, this.timeoutDuration - elaspedTime - this.subtractDuration) : this.timeoutDuration;
        this.timeout = setTimeout(() => {
            console.log(`User ${this.username} timed out`);
            this.onTimeout();
        }, remainingTime);
    }

    async onTimeout() {
        clearTimeout(this.timeout);
        const user = await User.findOne({ username: this.username });
        if (!user) {
            throw new GameError(500, gameErrors.USER_DATA_NOT_FOUND);
        }
        const usedVocab = user.usedVocabularies;
        const numberofPlay = await Game.getNumberofPlay(usedVocab);
        const rewards = calculateRewards(usedVocab, numberofPlay);
        const isCleared = numberofPlay == 5 ? true: false;
    
        // update user isFinished
        await user.updateOne({
            isFinished: true
        });

        // TODO: publish a game end event
        console.log({ username: this.username, isCleared, rewards });
    }
}

export const userTimers: Map<string, UserTimer> = new Map();
