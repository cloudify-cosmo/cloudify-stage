import { mapValues } from 'lodash';
import type { ReactNode } from 'react';
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

const i18nPrefix = 'widgets.deploymentsView';
const i18nColumnsPrefix = `${i18nPrefix}.columns`;

interface IconDescription {
    labelI18nKey: string;
    props: IconProps;
}
/**
 * A CID (Constrained Identity Function)
 * See https://kentcdodds.com/blog/how-to-write-a-constrained-identity-function-in-typescript
 */
const createIconDescriptions = <T extends Record<string, IconDescription>>(iconDescriptions: T) => iconDescriptions;

const statusIconDescriptions = createIconDescriptions({
    inProgress: {
        labelI18nKey: 'inProgress',
        props: { name: 'spinner', color: 'orange' }
    },
    requiresAttention: {
        labelI18nKey: 'requiresAttention',
        props: { name: 'exclamation', color: 'red' }
    }
});
type StatusIconName = keyof typeof statusIconDescriptions;
const renderStatusIcon = (iconName: StatusIconName) => {
    const { Icon, Popup } = Stage.Basic;
    const iconDescription = statusIconDescriptions[iconName];
    const label = Stage.i18n.t(`${i18nPrefix}.iconLabels.${iconDescription.labelI18nKey}`);

    return (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Popup trigger={<Icon aria-label={label} {...iconDescription.props} />} position="top center">
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
        /* eslint-disable camelcase, react/prop-types */
        render({ sub_environments_count = 0, sub_environments_status = SubdeploymentStatus.Good }) {
            const iconName = subdeploymentStatusToIconMapping[sub_environments_status];
            const icon = iconName && renderStatusIcon(iconName);

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
            const iconName = subdeploymentStatusToIconMapping[sub_services_status];
            const icon = iconName && renderStatusIcon(iconName);

            return (
                <>
                    {sub_services_count} {icon}
                </>
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
