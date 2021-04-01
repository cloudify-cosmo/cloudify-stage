import { mapValues } from 'lodash';
import type { ReactNode } from 'react';
import type { IconProps } from 'semantic-ui-react';

import { i18nPrefix } from '../common';
import { Deployment, DeploymentStatus, SubdeploymentStatus } from '../types';

// NOTE: the order in the array determines the order in the UI
export const deploymentsViewColumnIds = [
    'status',
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

/**
 * A CID (Constrained Identity Function)
 * See https://kentcdodds.com/blog/how-to-write-a-constrained-identity-function-in-typescript
 */
const createIconDescriptions = <T extends Record<string, IconProps>>(iconDescriptions: T) => iconDescriptions;

const statusIconPropsMapping = createIconDescriptions({
    inProgress: { name: 'spinner', color: 'orange' },
    requiresAttention: { name: 'exclamation', color: 'red' }
});
type StatusIconName = keyof typeof statusIconPropsMapping;
const renderStatusIcon = (iconName: StatusIconName) => {
    const { Icon, Popup } = Stage.Basic;
    const iconProps = statusIconPropsMapping[iconName];
    const label = Stage.i18n.t(`${i18nPrefix}.iconLabels.${iconName}`);

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Popup trigger={<Icon aria-label={label} {...iconProps} />} position="top center">
            {label}
        </Popup>
    );
};

const partialDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    Omit<Stage.Types.WithOptionalProperties<DeploymentsViewColumnDefinition, 'label'>, 'name' | 'tooltip'>
> = {
    status: {
        width: '20px',
        render(deployment) {
            const deploymentStatusIconProps: Record<DeploymentStatus, StatusIconName | undefined> = {
                [DeploymentStatus.Good]: undefined,
                [DeploymentStatus.InProgress]: 'inProgress',
                [DeploymentStatus.RequiresAttention]: 'requiresAttention'
            };
            const iconName = deploymentStatusIconProps[deployment.deployment_status];
            if (!iconName) {
                return null;
            }

            return renderStatusIcon(iconName);
        },
        // NOTE: do not show the column label
        label: ''
    },
    name: {
        sortFieldName: 'id',
        render(deployment) {
            return deployment.id;
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
        label: <Stage.Basic.Icon name="object group" />,
        width: '1em',
        // NOTE: properties come from the API. They are not prop-types (false-positive)
        /* eslint-disable camelcase */
        // TODO(RD-1839): remove default values
        render({ sub_environments_count = 0, sub_environments_status = SubdeploymentStatus.Good }) {
            const iconName = subdeploymentStatusToIconMapping[sub_environments_status];
            const icon = iconName && renderStatusIcon(iconName);

            return (
                <div className="subdeploymentColumn">
                    {sub_environments_count} {icon}
                </div>
            );
        }
    },
    subservicesCount: {
        label: <Stage.Basic.Icon name="cube" />,
        width: '1em',
        // TODO(RD-1839): remove default values
        render({ sub_services_count = 0, sub_services_status = SubdeploymentStatus.Good }) {
            const iconName = subdeploymentStatusToIconMapping[sub_services_status];
            const icon = iconName && renderStatusIcon(iconName);

            return (
                <div className="subdeploymentColumn">
                    {sub_services_count} {icon}
                </div>
            );
        }
        /* eslint-enable camelcase, react/prop-types */
    }
};

const subdeploymentStatusToIconMapping: Record<SubdeploymentStatus, StatusIconName | undefined> = {
    [SubdeploymentStatus.InProgress]: 'inProgress',
    [SubdeploymentStatus.Good]: undefined,
    [SubdeploymentStatus.Failed]: 'requiresAttention',
    [SubdeploymentStatus.Pending]: undefined
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
