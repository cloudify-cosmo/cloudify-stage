import type { CSSProperties, FunctionComponent, ReactNode } from 'react';
import React from 'react';
import type { DropdownMenuProps, DropdownProps } from 'semantic-ui-react';
import SideBarItem from './SideBarItem';
import { Dropdown } from '../basic';

interface SideBarDropdownItemProps extends DropdownProps {
    icon: ReactNode;
    label: string;
    style?: CSSProperties;
    children: DropdownMenuProps['children'];
}

const SideBarDropdownItem: FunctionComponent<SideBarDropdownItemProps> = ({ icon, label, style, onOpen, children }) => {
    return (
        <Dropdown trigger={<SideBarItem icon={icon} label={label} />} pointing="left" icon={null} fluid onOpen={onOpen}>
            <Dropdown.Menu style={{ margin: 0, ...style }}>{children}</Dropdown.Menu>
        </Dropdown>
    );
};

export default SideBarDropdownItem;
