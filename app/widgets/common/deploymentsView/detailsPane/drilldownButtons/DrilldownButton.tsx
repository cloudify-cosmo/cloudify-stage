import type { ComponentProps, FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../../../../../components/basic';

const ButtonContainer = styled.div`
    margin-bottom: 0.25rem;
    display: inline-block;
`;

// NOTE: technically, it should `Omit` `basic | color`, but then TS does not infer any props
// when using this component.
const DrilldownButton: FunctionComponent<ComponentProps<typeof Button>> = props => (
    <ButtonContainer>
        <Button {...props} basic color="blue" />
    </ButtonContainer>
);
export default DrilldownButton;
