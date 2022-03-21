import styled from 'styled-components';
import type { SemanticICONS } from 'semantic-ui-react';
import { StyledIcon } from './styles';

const IconWrapper = styled.div`
    padding: 16px 0;
`;

const StyledImage = styled.img`
    width: 82px;
`;

export interface ButtonIconProps {
    icon?: SemanticICONS;
    image?: string;
}

const ButtonIcon = ({ icon, image }: ButtonIconProps) => {
    return (
        <>
            {icon && (
                <IconWrapper>
                    <StyledIcon name={icon} />
                </IconWrapper>
            )}
            {image && <StyledImage src={image} />}
        </>
    );
};

export default ButtonIcon;
