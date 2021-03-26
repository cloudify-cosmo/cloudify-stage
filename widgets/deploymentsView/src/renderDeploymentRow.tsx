import { pick } from 'lodash';
import { ReactNode } from 'react';

import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId } from './columns';
import { Deployment, LatestExecutionStatus } from './types';

const renderDeploymentRow = (toolbox: Stage.Types.Toolbox, fieldsToShow: DeploymentsViewColumnId[]) => (
    deployment: Deployment
) => {
    const { DataTable } = Stage.Basic;
    const selectedDeploymentId = toolbox.getContext().getValue('deploymentId');
    const progressUnderline = getDeploymentProgressUnderline(deployment);

    return [
        <DataTable.Row
            key={deployment.id}
            className={progressUnderline ? undefined : 'deployment-progressless-row'}
            selected={deployment.id === selectedDeploymentId}
            onClick={() => toolbox.getContext().setValue('deploymentId', deployment.id)}
        >
            {Object.entries(deploymentsViewColumnDefinitions).map(([columnId, columnDefinition]) => (
                <DataTable.Data key={columnId}>{columnDefinition.render(deployment)}</DataTable.Data>
            ))}
        </DataTable.Row>,
        progressUnderline && (
            <DataTable.Row key={`${deployment.id}-progress`} className="deployment-progress-row">
                <DataTable.Data className="deployment-progress-row-cell" colSpan={fieldsToShow.length}>
                    {progressUnderline}
                </DataTable.Data>
            </DataTable.Row>
        )
    ].filter(Boolean);
};
export default renderDeploymentRow;

const executionStatusToClassNameMapping: Record<LatestExecutionStatus, string | undefined> = {
    [LatestExecutionStatus.Failed]: 'failed',
    [LatestExecutionStatus.InProgress]: 'in-progress',
    [LatestExecutionStatus.Cancelled]: undefined,
    [LatestExecutionStatus.Completed]: undefined
};
function getDeploymentProgressUnderline(deployment: Deployment): ReactNode {
    const progressClassName = executionStatusToClassNameMapping[deployment.latest_execution_status];
    if (!progressClassName) {
        return null;
    }

    const progressValue = Stage.Utils.Execution.getProgress(
        pick(deployment, 'total_operations', 'finished_operations')
    );

    return (
        <div
            style={{ width: `${progressValue}%` }}
            className={Stage.Utils.combineClassNames(['deployment-progress-bar', progressClassName])}
        />
    );
}
