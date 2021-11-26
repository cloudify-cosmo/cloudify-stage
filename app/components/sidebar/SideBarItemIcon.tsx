import React from 'react';
import { IconProps } from 'semantic-ui-react';
import styled from 'styled-components';
import { Icon } from '../basic';

// eslint-disable-next-line react/jsx-props-no-spreading
const SideBarItemIcon = styled(({ name, ...rest }: IconProps) => <Icon name={name ?? 'expand'} {...rest} />)`
    &&&&&& {
        margin-left: -10px;
        margin-right: 9px;
        margin-top: -2px;
        float: none;
        width: 1.2em;
        font-size: 19px;
    }
`;

export default SideBarItemIcon;
