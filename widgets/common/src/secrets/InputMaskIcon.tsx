import type { IconProps } from 'semantic-ui-react';

interface InputMaskIconProps {
    onClick: IconProps['onClick'];
    isInputMasked: boolean;
}

const { Icon } = Stage.Basic;

const InputMaskIcon = ({ isInputMasked, onClick }: InputMaskIconProps) => {
    const iconName = isInputMasked ? 'eye slash' : 'eye';

    return <Icon name={iconName} onClick={onClick} link />;
};

export default InputMaskIcon;
