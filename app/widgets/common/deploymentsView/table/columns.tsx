import type { ReactNode } from 'react';
import React from 'react';
import { mapValues } from 'lodash';

import i18n from 'i18next';
import { i18nPrefix, subenvironmentsIcon, subservicesIcon } from '../common';
import { DeploymentStatusIcon, SubdeploymentStatusIcon } from '../StatusIcon';
import type { Deployment } from '../types';
import { IdPopup, TextEllipsis } from '../../../../components/shared';
import { Icon } from '../../../../components/basic';
import type { SubdeploymentDrilldownButtonProps } from '../detailsPane/drilldownButtons/SubdeploymentDrilldownButton';
// NOTE: the order in the array determines the order in the UI
export const deploymentsViewColumnIds = [
    'status',
    'id',
    'name',
    'blueprintName',
    'environmentType',
    'location',
    'subenvironmentsCount',
    'subservicesCount'
] as const;

export type DeploymentsViewColumnId = typeof deploymentsViewColumnIds[number];

export interface DeploymentsViewColumnDefinition {
    /** Displayed in the configuration */
    name: string;
    /** Displayed in the table header */
    label: ReactNode;
    /** The name of the backend field to sort by */
    sortFieldName?: string;
    width?: string;
    tooltip?: ReactNode;
    render(deployment: Deployment): ReactNode;
    drillDown?: SubdeploymentDrilldownButtonProps['drillDown'];
}

const i18nColumnsPrefix = `${i18nPrefix}.columns`;

const partialDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    Omit<Stage.Types.WithOptionalProperties<DeploymentsViewColumnDefinition, 'label'>, 'name' | 'tooltip'>
> = {
    status: {
        width: '20px',
        render({ deployment_status: deploymentStatus }) {
            return <DeploymentStatusIcon status={deploymentStatus} />;
        },
        // NOTE: do not show the column label
        label: ''
    },
    id: {
        width: '20px',
        render({ id }) {
            return <IdPopup id={id} />;
        }
    },
    name: {
        sortFieldName: 'display_name',
        render({ display_name: displayName }) {
            return <TextEllipsis maxWidth="150px">{displayName}</TextEllipsis>;
        }
    },
    blueprintName: {
        sortFieldName: 'blueprint_id',
        render({ blueprint_id: blueprintId }) {
            return <TextEllipsis maxWidth="150px">{blueprintId}</TextEllipsis>;
        }
    },
    environmentType: {
        sortFieldName: 'environment_type',
        render({ environment_type: environmentType }) {
            return environmentType;
        }
    },
    location: {
        sortFieldName: 'site_name',
        render({ site_name: siteName }) {
            return <TextEllipsis maxWidth="70px">{siteName}</TextEllipsis>;
        }
    },
    subenvironmentsCount: {
        label: <Icon name={subenvironmentsIcon} />,
        width: '1em',
        // NOTE: properties come from the API. They are not prop-types (false-positive)
        /* eslint-disable camelcase */
        render({ sub_environments_count, sub_environments_status }) {
            return (
                <div className="subdeploymentColumn">
                    {sub_environments_count} <SubdeploymentStatusIcon status={sub_environments_status} />
                </div>
            );
        }
    },
    subservicesCount: {
        label: <Icon name={subservicesIcon} />,
        width: '1em',
        render({ sub_services_count, sub_services_status }) {
            return (
                <div className="subdeploymentColumn">
                    {sub_services_count}
                    <SubdeploymentStatusIcon status={sub_services_status} />
                </div>
            );
        }
        /* eslint-enable camelcase */
    }
};

export function getDeploymentsViewColumnDefinitions(): Record<
    DeploymentsViewColumnId,
    DeploymentsViewColumnDefinition
> {
    return mapValues(
        partialDeploymentsViewColumnDefinitions,
        (columnDefinition, columnId): DeploymentsViewColumnDefinition => {
            const name = i18n.t(`${i18nColumnsPrefix}.${columnId}.name`);
            const label = columnDefinition.label ?? name;
            const tooltip: string | null = i18n.t(`${i18nColumnsPrefix}.${columnId}.tooltip`, {
                defaultValue: null
            });

            return {
                ...columnDefinition,
                name,
                label,
                tooltip
            };
        }
    );
}
