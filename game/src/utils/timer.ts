import axios from "axios";

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
        // console.log(`Start a timer for ${this.username}`);
    }

    resetTimer(isReduce: boolean) {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        if (!isReduce) {
            this.timeout = setTimeout(() => {
                // console.log(`User ${this.username} timed out`);
                this.onTimeout(false);
            }, this.timeoutDuration);
        } else {
            const elaspedTime = new Date().getTime() - this.startTime.getTime();
            const remainingTime = Math.max(0, this.timeoutDuration - elaspedTime - this.subtractDuration);

            this.timeout = setTimeout(() => {
                // console.log(`User ${this.username} timed out`);
                this.onTimeout(false);
            }, remainingTime);
        }
    }

    async onTimeout(isEnd: boolean) {
        clearTimeout(this.timeout);
        const apiUrl = 'http://localhost:3000/api/game/end';
        const response = await axios.get(apiUrl);
        // console.log(response);
    }
}

export const userTimers: Map<string, UserTimer> = new Map();
