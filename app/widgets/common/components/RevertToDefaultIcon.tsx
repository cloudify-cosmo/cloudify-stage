import type { CSSProperties, ReactNode } from 'react';
import React from 'react';
import type { IconProps } from 'semantic-ui-react';
import i18n from 'i18next';
import { Icon, Popup } from '../../../components/basic';

interface RevertToDefaultIconProps {
    /**
     * field value
     */
    value?: any;

    /**
     * field default value
     */
    defaultValue?: any;

    /**
     * function to be called on revert icon click
     */
    onClick?: IconProps['onClick'];

    /**
     * function to be called on revert icon mouse down
     */
    onMouseDown?: IconProps['onMouseDown'];

    /**
     * popup content to be shown on mouse over
     */
    popupContent?: ReactNode;

    style?: CSSProperties;
}

function RevertToDefaultIcon({
    value,
    defaultValue,
    onClick,
    onMouseDown,
    popupContent = i18n.t('widgets.common.revertToDefault'),
    style = {}
}: RevertToDefaultIconProps) {
    if (defaultValue === undefined || _.isEqual(value, defaultValue)) {
        return null;
    }

    return (
        <Popup
            trigger={
                <Icon
                    aria-label="Revert value to default"
                    name="undo"
                    link
                    onClick={onClick}
                    onMouseDown={onMouseDown}
                    style={style}
                />
            }
        >
            {popupContent}
        </Popup>
    );
}

export default RevertToDefaultIcon;
