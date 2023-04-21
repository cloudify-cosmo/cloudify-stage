import type { ReactNode } from 'react';
import React from 'react';

import i18n from 'i18next';
import { groupBy } from 'lodash';
import type { DeploymentsViewColumnId } from './columns';
import { getDeploymentsViewColumnDefinitions } from './columns';
import type { Deployment } from '../types';
import { LatestExecutionStatus } from '../types';
import { selectDeployment } from '../common';

import { DataTable, Label } from '../../../../components/basic';
import StageUtils from '../../../../utils/stageUtils';
import { deploymentTypeFilterRule } from '../detailsPane/drilldownButtons/SubdeploymentDrilldownButton.consts';
import type { FilterRule } from '../../filters/types';

const title = (suffix: string) => i18n.t(`widgets.deploymentsView.drillDown.table.buttons.${suffix}`);

const renderDeploymentRow =
    (
        toolbox: Stage.Types.Toolbox,
        fieldsToShow: DeploymentsViewColumnId[],
        selectedDeployment: Deployment | undefined,
        keysOfLabelsToShow: string[]
    ) =>
    (deployment: Deployment) => {
        const progressUnderline = getDeploymentProgressUnderline(deployment);
        const labelsDict = groupBy(deployment.labels, 'key');

        const handleCellClick = (columnId: DeploymentsViewColumnId) => {
            if (columnId === 'subservicesCount' && deployment.sub_services_count !== 0) {
                drillDown(deployment, deploymentTypeFilterRule.services, 'Services');
            } else if (columnId === 'subenvironmentsCount' && deployment.sub_environments_count !== 0) {
                drillDown(deployment, deploymentTypeFilterRule.environments, 'Environments');
            }
        };

        const drillDown = (deploymentName: Deployment, filterRule: FilterRule, displaySuffix: string) => {
            const drilldownPageName = `${deploymentName.id} [${displaySuffix}]`;
            toolbox.drillDown(
                toolbox.getWidget(),
                'drilldownDeployments',
                { filterRules: [filterRule] },
                drilldownPageName
            );
        };

        const isSubServicesCountCell = (columnId: DeploymentsViewColumnId) => columnId === 'subservicesCount';
        const isSubEnvironmentsCountCell = (columnId: DeploymentsViewColumnId) => columnId === 'subenvironmentsCount';

        const isDrillDownCell = (columnId: DeploymentsViewColumnId) =>
            isSubServicesCountCell(columnId) || isSubEnvironmentsCountCell(columnId);

        const getCellTitle = (columnId: DeploymentsViewColumnId) => {
            if (isSubServicesCountCell(columnId) && deployment.sub_services_count !== 0) {
                return title('services');
            }
            if (isSubEnvironmentsCountCell(columnId) && deployment.sub_environments_count !== 0) {
                return title('environments');
            }
            return undefined;
        };

        return [
            <DataTable.Row
                key={deployment.id}
                className={progressUnderline ? undefined : 'deployment-progressless-row'}
                selected={deployment.id === selectedDeployment?.id}
                onClick={() => selectDeployment(toolbox, deployment.id)}
            >
                {Object.entries(getDeploymentsViewColumnDefinitions()).map(([columnId, columnDefinition]) => (
                    <DataTable.Data
                        key={columnId}
                        onClick={() => handleCellClick(columnId as DeploymentsViewColumnId)}
                        className={isDrillDownCell(columnId as DeploymentsViewColumnId) ? 'drilldown-cell' : undefined}
                        title={getCellTitle(columnId as DeploymentsViewColumnId)}
                    >
                        {columnDefinition.render(deployment)}
                    </DataTable.Data>
                ))}
                {keysOfLabelsToShow.map(labelKey => (
                    <DataTable.Data key={labelKey}>
                        {labelsDict[labelKey]?.map(({ value }) => (
                            <Label>{value}</Label>
                        ))}
                    </DataTable.Data>
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

    const progressValue = StageUtils.Execution.getProgress({
        total_operations: deployment.latest_execution_total_operations,
        finished_operations: deployment.latest_execution_finished_operations
    });

    return (
        <div
            style={{ width: `${progressValue}%` }}
            className={StageUtils.combineClassNames(['deployment-progress-bar', progressClassName])}
        />
    );
}
