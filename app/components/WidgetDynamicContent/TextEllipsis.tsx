import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

interface TextEllipsisProps {
    content: string;
}

const TextEllipsis = ({ content }: TextEllipsisProps) => {
    return <StyledWrapper title={content}>{content}</StyledWrapper>;
};

export default TextEllipsis;
