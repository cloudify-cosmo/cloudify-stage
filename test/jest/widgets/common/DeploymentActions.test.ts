import DeploymentActions from 'common/src/deployments/DeploymentActions';
import PollHelper from 'common/src/utils/PollHelper';
import ExecutionActions from 'common/src/executions/ExecutionActions';

jest.mock('common/src/utils/PollHelper');
const wait = jest.fn(() => Promise.resolve());
(<jest.Mock>PollHelper).mockImplementation(() => ({ wait }));

jest.mock('common/src/executions/ExecutionActions');
const doGetAll = jest.fn();
(<jest.Mock>ExecutionActions).mockImplementation(() => ({ doGetAll }));

describe('(Widgets common) DeploymentActions', () => {
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
