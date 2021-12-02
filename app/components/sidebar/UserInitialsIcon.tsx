import React from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Label } from '../basic';
import { ReduxState } from '../../reducers';

const StyledLabel = styled(Label)`
    &&&&& {
        float: none;
        margin-left: 0;
        margin-top: -5px;
        margin-right: 20px;
        width: 1.2em;
        padding-left: 4px !important;
    }
`;

const UserInitialsIcon: React.FunctionComponent = () => {
    const username = useSelector((state: ReduxState) => state.manager.username);

    return <StyledLabel circular>{username.substr(0, 2).toUpperCase()}</StyledLabel>;
};

export default UserInitialsIcon;
