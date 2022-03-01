import React from 'react';
import type { FunctionComponent, ReactNode, CSSProperties } from 'react';
import styled, { css } from 'styled-components';
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

type SideBarAnimatedItemWrapperProps = Pick<SideBarItemProps, 'subItem'>;

export const SideBarAnimatedItemWrapper = styled.div<SideBarAnimatedItemWrapperProps>`
    transition: transform 500ms ease;

    ${({ subItem }) =>
        subItem &&
        css`
            transform: translateX(10px);
        `}
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
    const menuItemStyle: CSSProperties = {
        height: '100%',
        width: expandedSidebarWidth,
        paddingTop: 13,
        paddingLeft: subItem && 15,
        ...style
    };

    return (
        <SideBarItemWrapper>
            <Menu.Item style={menuItemStyle} {...rest}>
                <SideBarAnimatedItemWrapper subItem={subItem}>
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
                </SideBarAnimatedItemWrapper>
            </Menu.Item>
        </SideBarItemWrapper>
    );
};

export default SideBarItem;
