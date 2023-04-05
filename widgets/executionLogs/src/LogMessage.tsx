import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div<{ expanded: boolean }>`
    overflow: hidden;
    text-overflow: ellipsis;
    ${props =>
        !props.expanded
            ? `
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;`
            : undefined}
    max-width: 100%;
    white-space: pre-wrap;
`;

const LogMessage: FunctionComponent = ({ children }) => {
    const { Icon } = Stage.Basic;
    const [expanded, changeExpanded] = Stage.Hooks.useToggle(false);

    return (
        <>
            <StyledDiv expanded={expanded}>{children ?? ''}</StyledDiv>
            <Icon name={expanded ? 'chevron down' : 'chevron up'} onClick={changeExpanded} style={{ float: 'right' }} />
        </>
    );
};

export default LogMessage;
