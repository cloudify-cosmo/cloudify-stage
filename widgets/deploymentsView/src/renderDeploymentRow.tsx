import { ReactNode } from 'react';
import { deploymentsViewColumnDefinitions, DeploymentsViewColumnId } from './columns';

const renderDeploymentRow = (toolbox: Stage.Types.Toolbox, fieldsToShow: DeploymentsViewColumnId[]) => (
    deployment: any
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

function getDeploymentProgressUnderline(_deployment: any): ReactNode {
    if (Math.random() < 0.5) {
        // TODO(RD-1224): adjust states to match the ones returned from API
        const deploymentStates = ['in-progress', 'pending', 'failure'];
        // NOTE: random state for now
        const state = deploymentStates[Math.floor(Math.random() * deploymentStates.length)];

        return (
            <div
                style={{ width: `${50 + Math.random() * 50}%` }}
                className={Stage.Utils.combineClassNames(['deployment-progress-bar', state])}
            />
        );
    }

    return null;
}
