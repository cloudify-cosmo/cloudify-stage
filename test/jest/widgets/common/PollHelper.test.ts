import PollHelper from 'widgets/common/utils/PollHelper';

describe('(Widgets common) PollHelper', () => {
    it('should reject when maximum number of attempts is exceeded', async () => {
        const pollHelper = new PollHelper(1);

        await pollHelper.wait();
        pollHelper.resetAttempts();
        await pollHelper.wait();
        await expect(pollHelper.wait()).rejects.toThrowError();
    });
});
