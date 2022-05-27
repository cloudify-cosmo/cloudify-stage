import React from 'react';
import styled from 'styled-components';
import Ellipsis from './Ellipsis';
import { Message } from '../basic';
import { ErrorPopup } from '../shared';
import { useBoolean } from '../../utils/hooks';
import type { ErrorPopupProps } from '../shared/ErrorPopup';

export interface ErrorMessageWithPopupProps {
    widgetName: string;
    header: ErrorPopupProps['header'];
    content: ErrorPopupProps['content'];
}

const StyledMessage = styled(Message)`
    &&& {
        display: flex;
        height: 100%;
        padding: 16px;
        opacity: 0.65;
        flex-direction: column;
        justify-content: center;
    }
`;

const ErrorMessageWithPopup = ({ widgetName, header, content }: ErrorMessageWithPopupProps) => {
    const [isPopupVisible, _, hidePopup] = useBoolean(true);
    const messageContent = `'${widgetName}' widget`;

    return (
        <ErrorPopup
            open={isPopupVisible}
            content={content}
            header={header}
            onDismiss={hidePopup}
            trigger={
                <div>
                    <StyledMessage error>
                        <Ellipsis content={messageContent} />
                    </StyledMessage>
                </div>
            }
        />
    );
};

export default ErrorMessageWithPopup;
