import type { ReactNode } from 'react';

import type { DeploymentsViewColumnId } from './columns';
import { deploymentsViewColumnDefinitions } from './columns';
import type { Deployment } from '../types';
import { LatestExecutionStatus } from '../types';
import { selectDeployment } from '../common';

const renderDeploymentRow =
    (
        toolbox: Stage.Types.Toolbox,
        fieldsToShow: DeploymentsViewColumnId[],
        selectedDeployment: Deployment | undefined
    ) =>
    (deployment: Deployment) => {
        const { DataTable } = Stage.Basic;
        const progressUnderline = getDeploymentProgressUnderline(deployment);

        return [
            <DataTable.Row
                key={deployment.id}
                className={progressUnderline ? undefined : 'deployment-progressless-row'}
                selected={deployment.id === selectedDeployment?.id}
                onClick={() => selectDeployment(toolbox, deployment.id)}
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

    const progressValue = Stage.Utils.Execution.getProgress({
        total_operations: deployment.latest_execution_total_operations,
        finished_operations: deployment.latest_execution_finished_operations
    });

    return (
        <div
            style={{ width: `${progressValue}%` }}
            className={Stage.Utils.combineClassNames(['deployment-progress-bar', progressClassName])}
        />
    );
}
