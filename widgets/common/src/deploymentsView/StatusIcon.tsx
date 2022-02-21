import type { CSSProperties, FunctionComponent } from 'react';
import type { IconProps } from 'semantic-ui-react';

import { i18nPrefix } from './common';
import { DeploymentStatus } from './types';

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

const BaseDeploymentStatusIcon: FunctionComponent<{ iconName?: StatusIconName; iconStyle?: CSSProperties }> = ({
    iconName,
    iconStyle
}) => {
    if (!iconName) {
        return null;
    }

    const { Icon, Popup } = Stage.Basic;
    const iconProps = statusIconPropsMapping[iconName];
    const label = Stage.i18n.t(`${i18nPrefix}.iconLabels.${iconName}`);

    return (
        <Popup trigger={<Icon aria-label={label} {...iconProps} style={iconStyle} />} position="top center">
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

export const SubdeploymentStatusIcon: FunctionComponent<{ status: DeploymentStatus | null; style?: CSSProperties }> = ({
    status,
    style
}) => (
    <BaseDeploymentStatusIcon
        iconName={deploymentStatusIconNameMapping[status ?? DeploymentStatus.Good]}
        iconStyle={style}
    />
);
