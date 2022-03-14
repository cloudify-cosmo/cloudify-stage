import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
    border: 1px solid grey;

    & + & {
        margin-left: 24px;
    }
`;

interface Props {
    children: ReactNode;
    onClick: () => void;
}

export const FirstUserJourneyButton: FunctionComponent<Props> = ({ children, onClick }) => {
    return <ButtonWrapper onClick={onClick}>{children}</ButtonWrapper>;
};
