import React from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';
import colors from 'cloudify-ui-common/styles/_colors.scss';
import type { MenuItemProps, SemanticICONS } from 'semantic-ui-react';
import { Icon, Menu } from '../basic';
import { expandedSidebarWidth } from './SideBar';
import SideBarItemIcon from './SideBarItemIcon';

export const SideBarItemWrapper = styled.div`
    position: relative;
    height: 37px;
    white-space: nowrap;
    overflow: hidden;
    flex-shrink: 0;
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
        <SideBarItemWrapper>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Menu.Item style={menuItemStyle} {...rest}>
                {typeof icon === 'string' ? <SideBarItemIcon name={icon as SemanticICONS} /> : icon}
                {label && <span style={{ verticalAlign: 'top' }}>{label}</span>}
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
