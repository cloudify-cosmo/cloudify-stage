import type { IconProps } from 'semantic-ui-react';

interface PasswordMaskIconProps {
    onClick: IconProps['onClick'];
    isPasswordMasked: boolean;
}

const { Icon } = Stage.Basic;

const PasswordMaskIcon = ({ isPasswordMasked, onClick }: PasswordMaskIconProps) => {
    const iconName = isPasswordMasked ? 'eye slash' : 'eye';

    return <Icon name={iconName} onClick={onClick} link />;
};

export default PasswordMaskIcon;
