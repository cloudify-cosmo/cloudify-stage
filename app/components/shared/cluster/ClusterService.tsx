import React from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';
import { clusterServiceIcon } from './consts';
import type { ClusterService as ClusterServiceName } from './types';
import { ClusterServiceWrapper, ClusterServiceHeader, ClusterServiceIcon, ClusterServiceLabel } from './styles';

interface ClusterServiceProps {
    name: ClusterServiceName;
    isExternal: boolean;
}

const ClusterService: FunctionComponent<ClusterServiceProps> = ({ name, isExternal }) => {
    const icon = clusterServiceIcon(name);

    return (
        <ClusterServiceWrapper>
            <ClusterServiceHeader floated="left">
                <ClusterServiceIcon name={icon} size="large" /> {i18n.t(`cluster.${name}`)}
            </ClusterServiceHeader>
            {isExternal && <ClusterServiceLabel color="black">External</ClusterServiceLabel>}
        </ClusterServiceWrapper>
    );
};
export default ClusterService;
