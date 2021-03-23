import { camelCase, mapValues } from 'lodash';
import type { ReactElement, ReactNode } from 'react';
import type { IconProps } from 'semantic-ui-react';
import { Deployment, DeploymentStatus, SubdeploymentStatus } from './types';

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

const i18nPrefix = 'widgets.deploymentsView.columns';

const inProgressIconProps: IconProps = { name: 'spinner', color: 'orange' };
const requiresAttentionIconProps: IconProps = { name: 'exclamation', color: 'red' };

const partialDeploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    Omit<Stage.Types.WithOptionalProperties<DeploymentsViewColumnDefinition, 'label'>, 'name' | 'tooltip'>
> = {
    status: {
        width: '20px',
        render(deployment) {
            const { Icon, Popup } = Stage.Basic;
            const deploymentStatusIconProps: Record<DeploymentStatus, IconProps | undefined> = {
                [DeploymentStatus.Good]: undefined,
                [DeploymentStatus.InProgress]: inProgressIconProps,
                [DeploymentStatus.RequiresAttention]: requiresAttentionIconProps
            };
            const iconProps = deploymentStatusIconProps[deployment.deployment_status];
            if (!iconProps) {
                return null;
            }
            const label = Stage.i18n.t(`${i18nPrefix}.status.iconLabels.${camelCase(deployment.deployment_status)}`);

            return (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <Popup trigger={<Icon aria-label={label} {...iconProps} />} position="top center">
                    {label}
                </Popup>
            );
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
        /* eslint-disable camelcase, react/prop-types */
        render({ sub_environments_count = 0, sub_environments_status = SubdeploymentStatus.Good }) {
            const icon = subdeploymentStatusToIconMapping[sub_environments_status];
            return (
                <>
                    {sub_environments_count} {icon}
                </>
            );
        }
    },
    subservicesCount: {
        label: <Stage.Basic.Icon name="cube" />,
        width: '1em',
        render({ sub_services_count = 0, sub_services_status = SubdeploymentStatus.Good }) {
            const icon = subdeploymentStatusToIconMapping[sub_services_status];
            return (
                <>
                    {sub_services_count} {icon}
                </>
            );
        }
        /* eslint-enable camelcase, react/prop-types */
    }
};

const subdeploymentStatusToIconMapping: Record<SubdeploymentStatus, ReactNode> = {
    // eslint-disable-next-line react/jsx-props-no-spreading
    [SubdeploymentStatus.InProgress]: <Stage.Basic.Icon {...inProgressIconProps} />,
    [SubdeploymentStatus.Good]: null,
    // eslint-disable-next-line react/jsx-props-no-spreading
    [SubdeploymentStatus.Failed]: <Stage.Basic.Icon {...requiresAttentionIconProps} />,
    [SubdeploymentStatus.Pending]: null
};

export const deploymentsViewColumnDefinitions: Record<
    DeploymentsViewColumnId,
    DeploymentsViewColumnDefinition
> = mapValues(
    partialDeploymentsViewColumnDefinitions,
    (columnDefinition, columnId): DeploymentsViewColumnDefinition => {
        const name = Stage.i18n.t(`${i18nPrefix}.${columnId}.name`);
        const label = columnDefinition.label ?? name;
        const tooltip: string | null = Stage.i18n.t(`${i18nPrefix}.${columnId}.tooltip`, { defaultValue: null });

        return {
            ...columnDefinition,
            name,
            label,
            tooltip
        };
    }
);
