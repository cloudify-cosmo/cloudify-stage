import React from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import type { FunctionComponent } from 'react';
import type { PopupProps } from 'semantic-ui-react';
import { Popup } from '../basic';

const StyledPopup = styled(Popup)`
    &&&&::before {
        background-color: inherit;
        box-shadow: -1px -1px 0 0 #e0b4b4;
    }
`;

export interface ErrorPopupProps {
    open: PopupProps['open'];
    trigger: PopupProps['trigger'];
    errorTitle?: string;
    errorMessage?: string;
    onDismiss: () => void;
}

// TODO: Implement max height for the error message, combined with a scrolling mechanism
const ErrorPopup: FunctionComponent<ErrorPopupProps> = ({
    open,
    trigger,
    errorTitle = 'Error has occured',
    errorMessage,
    onDismiss
}) => {
    return (
        <StyledPopup
            open={open}
            trigger={trigger}
            position="bottom left"
            className="ui error message"
            content={
                <>
                    <Icon name="close" onClick={onDismiss} />
                    {errorMessage}
                </>
            }
            header={errorTitle}
        />
    );
};

export default ErrorPopup;
