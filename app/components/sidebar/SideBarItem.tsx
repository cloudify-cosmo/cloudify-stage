import React, { CSSProperties, FunctionComponent } from 'react';
import styled from 'styled-components';
import colors from 'cloudify-ui-common/styles/_colors.scss';
import { Menu } from '../basic';

export const MenuItemWrapper = styled.div`
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
    .item.link:hover {
        text-decoration: none !important; // override semantic ui styles
    }
`;

interface SideBarItemProps {
    style?: CSSProperties;
}

const SideBarItem: FunctionComponent<SideBarItemProps> = ({ style, ...rest }) => {
    return (
        <MenuItemWrapper>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Menu.Item style={{ height: '100%', ...style }} {...rest} />
        </MenuItemWrapper>
    );
};

export default SideBarItem;
