import { mapValues } from 'lodash';
import type { ReactNode } from 'react';

import { i18nPrefix, subenvironmentsIcon, subservicesIcon } from '../common';
import { DeploymentStatusIcon, SubdeploymentStatusIcon } from '../StatusIcon';
import type { Deployment } from '../types';

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
}

const i18nColumnsPrefix = `${i18nPrefix}.columns`;

const partialDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    Omit<Stage.Types.WithOptionalProperties<DeploymentsViewColumnDefinition, 'label'>, 'name' | 'tooltip'>
> = {
    status: {
        width: '20px',
        render(deployment) {
            // NOTE: Rule reports false positives (ref.: https://github.com/yannickcr/eslint-plugin-react/issues/3022)
            // eslint-disable-next-line react/destructuring-assignment
            return <DeploymentStatusIcon status={deployment.deployment_status} />;
        },
        // NOTE: do not show the column label
        label: ''
    },
    id: {
        width: '20px',
        render(deployment) {
            // NOTE: Rule reports false positives (ref.: https://github.com/yannickcr/eslint-plugin-react/issues/3022)
            // eslint-disable-next-line react/destructuring-assignment
            return <Stage.Shared.IdPopup id={deployment.id} />;
        }
    },
    name: {
        sortFieldName: 'display_name',
        render(deployment) {
            return deployment.display_name;
        }
    },
    blueprintName: {
        sortFieldName: 'blueprint_id',
        render(deployment) {
            return deployment.blueprint_id;
        }
    },
    environmentType: {
        sortFieldName: 'environment_type',
        render(deployment) {
            return deployment.environment_type;
        }
    },
    location: {
        sortFieldName: 'site_name',
        render(deployment) {
            return deployment.site_name;
        }
    },
    subenvironmentsCount: {
        label: <Stage.Basic.Icon name={subenvironmentsIcon} />,
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
        label: <Stage.Basic.Icon name={subservicesIcon} />,
        width: '1em',
        render({ sub_services_count, sub_services_status }) {
            return (
                <div className="subdeploymentColumn">
                    {sub_services_count} <SubdeploymentStatusIcon status={sub_services_status} />
                </div>
            );
        }
        /* eslint-enable camelcase */
    }
};

export const deploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    DeploymentsViewColumnDefinition
> = mapValues(
    partialDeploymentsViewColumnDefinitions,
    (columnDefinition, columnId): DeploymentsViewColumnDefinition => {
        const name = Stage.i18n.t(`${i18nColumnsPrefix}.${columnId}.name`);
        const label = columnDefinition.label ?? name;
        const tooltip: string | null = Stage.i18n.t(`${i18nColumnsPrefix}.${columnId}.tooltip`, { defaultValue: null });

        return {
            ...columnDefinition,
            name,
            label,
            tooltip
        };
    }
);
