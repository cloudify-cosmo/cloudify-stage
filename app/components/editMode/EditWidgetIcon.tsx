import React from 'react';
import type { FunctionComponent } from 'react';
import type { IconProps } from 'semantic-ui-react';
import { Icon } from '../basic';

export interface EditWidgetIconProps {
    onShowConfig: () => void;
    size?: IconProps['size'];
}

const EditWidgetIcon: FunctionComponent<EditWidgetIconProps> = ({ onShowConfig, size }) => (
    <Icon
        name="setting"
        link
        size={size}
        className="editWidgetIcon"
        onClick={(event: Event) => {
            event.stopPropagation();
            onShowConfig();
        }}
    />
);
export default EditWidgetIcon;
