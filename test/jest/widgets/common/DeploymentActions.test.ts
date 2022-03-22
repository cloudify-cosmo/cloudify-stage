import DeploymentActions from 'common/src/deployments/DeploymentActions';

describe('(Widgets common) DeploymentActions', () => {
    const wait = jest.fn(() => Promise.resolve());
    const doGetAll = jest.fn();

    beforeEach(() => {
        Stage.Common = {
            PollHelper() {
                this.wait = wait;
            },
            ExecutionActions() {
                this.doGetAll = doGetAll;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
    });

    it('waits for deployment to complete', () => {
        doGetAll.mockResolvedValueOnce({});
        doGetAll.mockResolvedValueOnce({ items: [{}] });

        const deploymentId = 'depId';

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return new DeploymentActions(undefined as any).waitUntilCreated(deploymentId).then(() => {
            expect(wait).toHaveReturnedTimes(2);
            expect(doGetAll).toHaveBeenCalledWith({ _include: 'id,status,ended_at', deployment_id: deploymentId });
            expect(doGetAll).toHaveBeenCalledTimes(2);
        });
    });
});
