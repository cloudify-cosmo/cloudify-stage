import _ from 'lodash';

import DeploymentStates from 'common/src/DeploymentStates';

describe('(Widgets common) DeploymentStates', () => {
    beforeEach(() => {
        // @ts-expect-error Necessary when overriding
        Stage.Utils = {
            Execution: { isActiveExecution: _.constant(false), isFailedExecution: _.constant(false) }
        };
    });

    it('returns in progress state', () => {
        Stage.Utils.Execution.isActiveExecution = _.constant(true);
        expect(DeploymentStates.getDeploymentState('', {})).toBe(DeploymentStates.IN_PROGRESS_STATE);
    });

    it('returns failed state', () => {
        Stage.Utils.Execution.isFailedExecution = _.constant(true);
        expect(DeploymentStates.getDeploymentState('', {})).toBe(DeploymentStates.FAILED_STATE);
    });

    it('returns good state', () => {
        const deploymentId = 'depId';
        expect(DeploymentStates.getDeploymentState(deploymentId, { [deploymentId]: { states: { started: 0 } } })).toBe(
            DeploymentStates.GOOD_STATE
        );
    });

    it('return pending state', () => {
        expect(DeploymentStates.getDeploymentState('', {})).toBe(DeploymentStates.PENDING_STATE);
    });
});
