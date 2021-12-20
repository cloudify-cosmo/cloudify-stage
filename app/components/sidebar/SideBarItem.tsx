import React from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import type { MenuItemProps, SemanticICONS } from 'semantic-ui-react';
import { Icon, Menu } from '../basic';
import { expandedSidebarWidth } from './SideBar';
import SideBarItemIcon from './SideBarItemIcon';

export const sideBarItemFontSize = '15px';

export const SideBarItemWrapper = styled.div`
    position: relative;
    height: 45px;
    white-space: nowrap;
    flex-shrink: 0;
    .item:hover {
        text-decoration: none !important; // override semantic ui styles
    }
`;

export interface SideBarItemProps extends MenuItemProps {
    subItem?: boolean;
    expandable?: boolean;
    expanded?: boolean;
    icon?: ReactNode | SemanticICONS;
    label?: string;
}

const SideBarItem: FunctionComponent<SideBarItemProps> = ({
    style,
    subItem,
    expandable,
    expanded,
    icon,
    label,
    children,
    ...rest
}) => {
    const menuItemStyle = {
        height: '100%',
        width: expandedSidebarWidth,
        paddingTop: 13,
        paddingLeft: subItem && 25,
        ...style
    };

    return (
        <SideBarItemWrapper className="sidebarItemWrapper">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Menu.Item style={menuItemStyle} {...rest}>
                {typeof icon === 'string' ? <SideBarItemIcon name={icon as SemanticICONS} /> : icon}
                {label && <span style={{ verticalAlign: 'top', fontSize: sideBarItemFontSize }}>{label}</span>}
                {children}
                {expandable && (
                    <Icon
                        name="dropdown"
                        rotated={expanded ? undefined : 'counterclockwise'}
                        style={{ position: 'absolute', right: 12, margin: 0 }}
                    />
                )}
            </Menu.Item>
        </SideBarItemWrapper>
    );
};

export default SideBarItem;
