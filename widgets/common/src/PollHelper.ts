export default class PollHelper {
    private attempts = 0;

    private waitInterval = 100;

    private readonly maxAttempts: number;

    constructor(maxAttempts: number) {
        this.maxAttempts = maxAttempts;
    }

    public wait(): Promise<void> {
        this.attempts += 1;
        if (this.attempts > this.maxAttempts) {
            return Promise.reject(new Error('Timeout exceeded'));
        }

        this.waitInterval = Math.min(1000, this.waitInterval + 100);

        return new Promise(resolve => setTimeout(resolve, this.waitInterval));
    }

    public resetAttempts() {
        this.attempts = 0;
    }
}

// NOTE: alias name to avoid name shadowing inside the namespace
const PH = PollHelper;
declare global {
    namespace Stage.Common {
        const PollHelper: typeof PH;
    }
}

Stage.defineCommon({
    name: 'PollHelper',
    common: PollHelper
});
