import type { ComponentProps, FunctionComponent } from 'react';
import styled from 'styled-components';

const ButtonContainer = styled.div`
    margin-bottom: 0.25rem;
    display: inline-block;
`;

// NOTE: technically, it should `Omit` `basic | color`, but then TS does not infer any props
// when using this component.
const DrilldownButton: FunctionComponent<ComponentProps<typeof Stage.Basic['Button']>> = props => (
    <ButtonContainer>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Stage.Basic.Button {...props} basic color="blue" />
    </ButtonContainer>
);
export default DrilldownButton;
