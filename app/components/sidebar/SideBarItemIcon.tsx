import React from 'react';
import { IconProps } from 'semantic-ui-react';
import { Icon } from '../basic';

export const defaultStyle = {
    marginLeft: 2,
    marginRight: 20,
    float: 'none',
    width: '1.2em'
};

const SideBarItemIcon = ({ name, style, ...rest }: IconProps) => (
    <Icon
        name={name ?? 'expand'}
        style={{
            marginTop: -2,
            fontSize: 19,
            ...defaultStyle,
            ...style
        }}
        {...rest}
    />
);

export default SideBarItemIcon;
