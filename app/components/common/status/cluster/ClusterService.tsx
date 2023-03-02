import React from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import { clusterServiceIcon } from './consts';
import { Header, Icon, Label } from '../../../basic';
import type { ClusterService as ClusterServiceName } from './types';

interface ClusterServiceProps {
    name: ClusterServiceName;
    isExternal: boolean;
}

const ClusterServiceWrapper = styled.div`
    vertical-align: middle;
    overflow: auto;
`;

const ClusterServiceHeader = styled(Header)`
    &&&& {
        margin: 0;
        font-size: 16px;
    }
`;

const ClusterServiceIcon = styled(Icon)`
    &&&& {
        font-size: 16px;
    }
`;

const ClusterServiceLabel = styled(Label)`
    margin-left: 10px;
    float: right;
`;

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
