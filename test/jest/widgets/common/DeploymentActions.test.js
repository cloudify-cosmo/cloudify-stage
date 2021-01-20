import DeploymentActions from 'common/src/DeploymentActions';

describe('(Widgets common) DeploymentActions', () => {
    const wait = jest.fn(() => Promise.resolve());
    const doGetExecutions = jest.fn();

    beforeEach(() => {
        Stage.Common = {
            PollHelper() {
                this.wait = wait;
            },
            ExecutionActions() {
                this.doGetExecutions = doGetExecutions;
            }
        };
    });

    it('waits for deployment to complete', () => {
        doGetExecutions.mockResolvedValueOnce([]);
        doGetExecutions.mockResolvedValueOnce([{}]);

        const deploymentId = 'depId';

        return new DeploymentActions().waitUntilCreated(deploymentId).then(() => {
            expect(wait).toHaveReturnedTimes(2);
            expect(doGetExecutions).toHaveBeenCalledWith(deploymentId);
            expect(doGetExecutions).toHaveBeenCalledTimes(2);
        });
    });
});
