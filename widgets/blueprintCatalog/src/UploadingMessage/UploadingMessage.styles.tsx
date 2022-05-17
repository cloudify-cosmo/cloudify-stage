import styled from 'styled-components';

export const MessageLine = styled.span`
    display: block;
`;

export const MessageHeader = styled(MessageLine)`
    font-weight: bold;
`;

export const MessageDescription = styled(MessageLine)`
    opacity: 0.75;
    margin-top: 4px;
`;
