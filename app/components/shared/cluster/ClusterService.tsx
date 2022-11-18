import React from 'react';
import i18n from 'i18next';
import type { FunctionComponent } from 'react';
import styled from 'styled-components';
import { clusterServiceIcon } from './consts';
import { Header, Icon, Label } from '../../basic';
import type { ClusterService as ClusterServiceName } from './types';

interface ClusterServiceProps {
    name: ClusterServiceName;
    isExternal: boolean;
}

const ClusterWrapper = styled.div`
    vertical-align: middle;
    padding: 10px;
    overflow: auto;
`;

const ClusterHeader = styled(Header)`
    margin: 0;
}`;

const ClusterIcon = styled(Icon)`
    &&&& {
        display: inline-block;
        margin-right: 0.75rem;
    }
`;

const ClusterText = styled.span`
    font-size: 16px;
`;

const ClusterLabel = styled(Label)`
    margin-left: 10px;
    float: right;
`;

const ClusterService: FunctionComponent<ClusterServiceProps> = ({ name, isExternal }) => {
    const icon = clusterServiceIcon(name);

    return (
        <ClusterWrapper>
            <ClusterHeader floated="left">
                <ClusterIcon name={icon} size="large" />
                <ClusterText> {i18n.t(`cluster.${name}`)} </ClusterText>
            </ClusterHeader>
            {isExternal && <ClusterLabel color="black">External</ClusterLabel>}
        </ClusterWrapper>
    );
};
export default ClusterService;
