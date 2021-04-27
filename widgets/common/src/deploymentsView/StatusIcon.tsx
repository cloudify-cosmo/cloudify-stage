import type { FunctionComponent } from 'react';
import type { IconProps } from 'semantic-ui-react';

import { i18nPrefix } from './common';
import { DeploymentStatus, SubdeploymentStatus } from './types';

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

const BaseDeploymentStatusIcon: FunctionComponent<{ iconName?: StatusIconName }> = ({ iconName }) => {
    if (!iconName) {
        return null;
    }

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

const deploymentStatusIconNameMapping: Record<DeploymentStatus, StatusIconName | undefined> = {
    [DeploymentStatus.Good]: undefined,
    [DeploymentStatus.InProgress]: 'inProgress',
    [DeploymentStatus.RequiresAttention]: 'requiresAttention'
};
export const DeploymentStatusIcon: FunctionComponent<{ status: DeploymentStatus }> = ({ status }) => (
    <BaseDeploymentStatusIcon iconName={deploymentStatusIconNameMapping[status]} />
);

const subdeploymentStatusToIconMapping: Record<SubdeploymentStatus, StatusIconName | undefined> = {
    [SubdeploymentStatus.InProgress]: 'inProgress',
    [SubdeploymentStatus.Good]: undefined,
    [SubdeploymentStatus.Failed]: 'requiresAttention',
    [SubdeploymentStatus.Pending]: undefined
};
export const SubdeploymentStatusIcon: FunctionComponent<{ status: SubdeploymentStatus | null }> = ({ status }) => (
    // NOTE: handle possible `null`s
    <BaseDeploymentStatusIcon iconName={subdeploymentStatusToIconMapping[status ?? SubdeploymentStatus.Good]} />
);
