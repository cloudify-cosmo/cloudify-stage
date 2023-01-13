import React from 'react';
import styled from 'styled-components';

interface TextEllipsisProps {
    /**
     * text content
     */
    children?: string | null;

    /**
     * text value of max-width style property
     */
    maxWidth?: string;

    /**
     * number of allowed lines
     */
    multiline?: number;
}

const StyledDiv = styled.div<TextEllipsisProps>`
    overflow: hidden;
    text-overflow: ellipsis;
    ${props =>
        props.multiline
            ? `
        display: -webkit-box;
        -webkit-line-clamp: ${props.multiline};
        -webkit-box-orient: vertical;`
            : `white-space: nowrap;`}
    ${props =>
        props.maxWidth &&
        `
        max-width: ${props.maxWidth}
    `}
`;

const TextEllipsis = ({ children, ...rest }: TextEllipsisProps) => (
    <StyledDiv title={children ?? ''} {...rest}>
        {children ?? ''}
    </StyledDiv>
);

export default TextEllipsis;
