import React from 'react';
import styled from 'styled-components';
import { Message } from '../basic';

interface WidgetErrorMessageProps {
    widgetName: string;
}

const StyledMessage = styled(Message)`
    &&& {
        padding: 16px;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

const WidgetErrorMessage = ({ widgetName }: WidgetErrorMessageProps) => {
    const messageContent = `'${widgetName}' widget`;
    return <StyledMessage error>{messageContent}</StyledMessage>;
};

export default WidgetErrorMessage;
