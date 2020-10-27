import DeploymentStates from 'common/src/DeploymentStates';

describe('(Widgets common) DeploymentStates', () => {
    beforeEach(() => {
        Stage.Utils = { Execution: { isActiveExecution: _.noop, isFailedExecution: _.noop } };
    });

    it('returns in progress state', () => {
        Stage.Utils.Execution.isActiveExecution = _.constant(true);
        expect(DeploymentStates.getDeploymentState(null, {})).toBe(DeploymentStates.IN_PROGRESS_STATE);
    });

    it('returns failed state', () => {
        Stage.Utils.Execution.isFailedExecution = _.constant(true);
        expect(DeploymentStates.getDeploymentState(null, {})).toBe(DeploymentStates.FAILED_STATE);
    });

    it('returns good state', () => {
        const deploymentId = 'depId';
        expect(DeploymentStates.getDeploymentState(deploymentId, { [deploymentId]: { states: { started: 0 } } })).toBe(
            DeploymentStates.GOOD_STATE
        );
    });

    it('return pending state', () => {
        expect(DeploymentStates.getDeploymentState(null, {})).toBe(DeploymentStates.PENDING_STATE);
    });
});
