import React from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import type { FunctionComponent } from 'react';
import type { PopupProps } from 'semantic-ui-react';
import { Popup } from '../basic';

const StyledPopup = styled(Popup)`
    /* TODO: Depending on the popup positon (on the top or on the bottom of an element), box shadow of the popup triangle should be positioned differently */
    &.bottom {
        --box-shadow-position: -1px -1px;
    }

    &.top {
        --box-shadow-position: 1px 1px;
    }

    &&&& {
        border: none;

        &::before {
            background-color: inherit;
            box-shadow: var(--box-shadow-position) 0 0 #e0b4b4;
        }
    }
`;

export interface ErrorPopupProps {
    open: PopupProps['open'];
    trigger: PopupProps['trigger'];
    header?: PopupProps['header'];
    content: PopupProps['content'];
    onDismiss: () => void;
}

const ErrorPopup: FunctionComponent<ErrorPopupProps> = ({ open, trigger, header, content, onDismiss }) => {
    return (
        <StyledPopup
            open={open}
            trigger={trigger}
            className="ui error message"
            position="top left"
            content={
                <>
                    <Icon name="close" onClick={onDismiss} />
                    {content}
                </>
            }
            header={header}
        />
    );
};

export default ErrorPopup;
