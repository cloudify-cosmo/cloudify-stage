import type { ButtonHTMLAttributes } from 'react';
import React from 'react';
import type { StrictButtonProps } from 'semantic-ui-react';

import { Button } from '../../basic';
import './EditModeButton.css';

type EditModeButtonProps = Pick<StrictButtonProps, 'className' | 'content' | 'icon' | 'labelPosition' | 'onClick'> &
    Pick<ButtonHTMLAttributes<any>, 'style' | 'title'>;

export default function EditModeButton({
    className,
    icon,
    labelPosition,
    content,
    style,
    title,
    onClick
}: EditModeButtonProps) {
    return (
        <Button
            className={`editModeButton ${className}`}
            icon={icon}
            labelPosition={labelPosition}
            basic
            content={content}
            style={style}
            onClick={onClick}
            title={title}
        />
    );
}
