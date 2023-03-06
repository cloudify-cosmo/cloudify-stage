import React from 'react';
import styled from 'styled-components';

interface GridWrapperProps {
    /**
     * text content
     */
    children?: React.ReactNode;
}

const StyledDiv = styled.div<GridWrapperProps>`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 3fr));
    grid-gap: 20px;
    margin-bottom: 1rem;
`;

const GridWrapper = ({ children, ...rest }: GridWrapperProps) => <StyledDiv {...rest}>{children}</StyledDiv>;

export default GridWrapper;
