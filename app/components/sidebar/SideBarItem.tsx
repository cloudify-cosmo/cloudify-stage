import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import colors from 'cloudify-ui-common/styles/_colors.scss';
import { MenuItemProps } from 'semantic-ui-react';
import { Menu } from '../basic';
import { expandedSidebarWidth } from './SideBar';

export const SideBarItemWrapper = styled.div`
    position: relative;
    height: 37px;
    white-space: nowrap;
    overflow: hidden;
    &:before {
        background-color: ${colors.greyNormal};
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
    }

    .item:before {
        background-color: ${colors.greyNormal};
    }
    .item:hover {
        text-decoration: none !important; // override semantic ui styles
    }
`;

interface SideBarItemProps extends MenuItemProps {
    subItem?: boolean;
}

const SideBarItem: FunctionComponent<SideBarItemProps> = ({ style, subItem, ...rest }) => {
    const menuItemStyle = { height: '100%', width: expandedSidebarWidth, paddingLeft: subItem && 25, ...style };

    return (
        <SideBarItemWrapper>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Menu.Item style={menuItemStyle} {...rest} />
        </SideBarItemWrapper>
    );
};

export default SideBarItem;
