import React from 'react';
import styled from 'styled-components';
import type { SemanticICONS } from 'semantic-ui-react';

const { Icon } = Stage.Basic;

export const StyledIcon = styled(Icon)`
    color: #65adff;
    line-height: 1;

    && {
        font-size: 56px;
    }
`;

export const IconWrapper = styled.div`
    padding: 12px 0;
`;

interface ButtonIconProps {
    icon: SemanticICONS;
}

export const ButtonIcon = ({ icon }: ButtonIconProps) => {
    return (
        <IconWrapper>
            <StyledIcon name={icon} />
        </IconWrapper>
    );
};
