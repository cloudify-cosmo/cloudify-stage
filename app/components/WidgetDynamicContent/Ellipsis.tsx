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

// TODO: Add node about the ticket related to extracting Ellipsis functionality as a shared component
const Ellipsis = ({ content }: EllipsisProps) => {
    return <StyledWrapper title={content}>{content}</StyledWrapper>;
};

export default Ellipsis;
