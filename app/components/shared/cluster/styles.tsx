import styled from 'styled-components';
import { Header, Icon, Label } from '../../basic';

export const ClusterServiceWrapper = styled.div`
    vertical-align: middle;
    padding: 10px;
    overflow: auto;
`;

export const ClusterServiceHeader = styled(Header)`
    &&&& {
        margin: 0;
        font-size: 16px;
    }
`;

export const ClusterServiceIcon = styled(Icon)`
    &&&& {
        font-size: 16px;
    }
`;

export const ClusterServiceLabel = styled(Label)`
    margin-left: 10px;
    float: right;
`;
