import type { SemanticICONS } from 'semantic-ui-react';
import styled from 'styled-components';
import colors from '../../../../app/styles/colors.scss';

const { Icon } = Stage.Basic;

export const StyledLabel = styled.div`
    padding: 0 32px;
    font-size: 16px;
    font-weight: bold;
`;

interface StyledIconProps {
    name: SemanticICONS;
}
export const StyledIcon = styled(Icon)<StyledIconProps>`
    color: ${colors.cloudifyBlue};
    line-height: 1;

    && {
        font-size: 56px;
    }
`;
