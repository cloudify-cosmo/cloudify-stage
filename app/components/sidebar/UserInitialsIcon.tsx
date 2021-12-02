import React from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Label } from '../basic';
import { ReduxState } from '../../reducers';
import { defaultStyle } from './SideBarItemIcon';

const StyledLabel = styled(Label)`
    &&&&& {
        margin-top: -5px;
        padding-left: 4px !important;
    }
`;

const UserInitialsIcon: React.FunctionComponent = () => {
    const username = useSelector((state: ReduxState) => state.manager.username);

    return (
        <StyledLabel style={defaultStyle} circular>
            {username.substr(0, 2).toUpperCase()}
        </StyledLabel>
    );
};

export default UserInitialsIcon;
