import React from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';

import { clusterServiceIcon } from './consts';
import { Header, Icon, Label } from '../../basic';
import type { ClusterService as ClusterServiceName } from './types';

interface ClusterServiceProps {
    name: ClusterServiceName;
    isExternal: boolean;
}
const ClusterService: FunctionComponent<ClusterServiceProps> = ({ name, isExternal }) => {
    const icon = clusterServiceIcon(name);

    return (
        <div style={{ verticalAlign: 'middle', padding: 10, overflow: 'auto' }}>
            <Header floated="left" style={{ margin: 0 }}>
                <Icon name={icon} size="large" /> {i18n.t(`cluster.${name}`)}
            </Header>
            {isExternal && (
                <Label color="black" style={{ marginLeft: 10, float: 'right' }}>
                    External
                </Label>
            )}
        </div>
    );
};
export default ClusterService;
