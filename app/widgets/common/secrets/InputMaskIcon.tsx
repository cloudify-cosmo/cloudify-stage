import React from 'react';
import type { IconProps } from 'semantic-ui-react';
import { Icon } from '../../../components/basic';

interface InputMaskIconProps {
    onClick: IconProps['onClick'];
    isInputMasked: boolean;
}

const InputMaskIcon = ({ isInputMasked, onClick }: InputMaskIconProps) => {
    const iconName = isInputMasked ? 'eye slash' : 'eye';

    return <Icon name={iconName} onClick={onClick} link />;
};

export default InputMaskIcon;
