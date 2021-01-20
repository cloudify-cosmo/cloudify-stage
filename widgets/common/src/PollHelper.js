export default class PollHelper {
    constructor(maxAttempts) {
        this.maxAttempts = maxAttempts;
        this.attempts = 0;
        this.waitInterval = 0;
    }

    wait() {
        this.attempts += 1;
        if (this.attempts > this.maxAttempts) {
            return Promise.reject(Error('Timeout exceeded'));
        }

        this.waitInterval = Math.min(1000, this.waitInterval + 100);

        return new Promise(resolve => setTimeout(resolve, this.waitInterval));
    }

    resetAttempts() {
        this.attempts = 0;
    }
}

Stage.defineCommon({
    name: 'PollHelper',
    common: PollHelper
});
