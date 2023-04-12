import type { FunctionComponent } from 'react';
import React from 'react';
import styled from 'styled-components';
import { useIsOverflow } from './useIsOverflow';

const ExpandableMessage = styled.div<{ expanded: boolean }>`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    ${props =>
        !props.expanded
            ? `
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;`
            : undefined}
`;

interface LogMessageProps {
    message: string;
}
const LogMessage: FunctionComponent<LogMessageProps> = ({ message }) => {
    const { Icon } = Stage.Basic;
    const [isExpanded, toggleExpandCollapse] = Stage.Hooks.useToggle(false);
    const expandableMessageRef = React.useRef<HTMLDivElement>(null);
    const isMessageOverflowing = useIsOverflow(expandableMessageRef);
    const showExpandCollapseIcon = isMessageOverflowing || isExpanded;

    return (
        <>
            {showExpandCollapseIcon && (
                <Icon
                    link
                    name={isExpanded ? 'chevron up' : 'chevron down'}
                    onClick={toggleExpandCollapse}
                    style={{ float: 'right', verticalAlign: 'top' }}
                />
            )}
            <ExpandableMessage expanded={isExpanded} ref={expandableMessageRef}>
                {message}
            </ExpandableMessage>
        </>
    );
};

export default LogMessage;
