import React, { useMemo } from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Label } from '../basic';
import type { ReduxState } from '../../reducers';
import { defaultStyle } from './SideBarItemIcon';

const StyledLabel = styled(Label)`
    &&&&& {
        background: #65adff;
        margin-top: -5px;
        padding-left: 4px !important;
    }
`;

const UserInitialsIcon: React.FunctionComponent = () => {
    const username = useSelector((state: ReduxState) => state.manager.auth.username);
    const userInitials = useMemo(() => {
        return username.substr(0, 2).toUpperCase();
    }, [username]);

    return (
        <StyledLabel style={defaultStyle} circular>
            {userInitials}
        </StyledLabel>
    );
};

export default UserInitialsIcon;
