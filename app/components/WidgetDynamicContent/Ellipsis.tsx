import React from 'react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

interface EllipsisProps {
    content: string;
}

const Ellipsis = ({ content }: EllipsisProps) => {
    return <StyledWrapper title={content}>{content}</StyledWrapper>;
};

export default Ellipsis;
