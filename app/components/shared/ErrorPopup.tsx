import React from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import type { FunctionComponent } from 'react';
import type { PopupProps } from 'semantic-ui-react';
import { Popup } from '../basic';

const errorMessageBorderColor = '#e0b4b4';

const StyledPopup = styled(Popup)`
    /* NOTE: Depending on the popup positon (on the top or on the bottom of an element), box shadow of the popup triangle should be positioned differently */
    &.bottom {
        --box-shadow-position: -1px -1px;
    }

    &.top {
        --box-shadow-position: 1px 1px;
    }

    &&&& {
        border: none;
        max-width: 300px;

        &::before {
            background-color: inherit;
            box-shadow: var(--box-shadow-position) 0 0 ${errorMessageBorderColor};
        }
    }
`;

const HeaderWrapper = styled.div`
    /* NOTE: In some cases the "x" icon is overflowing the header content. */
    /* Note: Because of the '.ui.popup>.header' selector (coming from semantic-ui-react) specificity, !important flag seems like a valid option here */
    padding-right: 14px !important;
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
            header={<HeaderWrapper className="header">{header}</HeaderWrapper>}
            content={
                <>
                    {content}
                    <Icon name="close" onClick={onDismiss} />
                </>
            }
        />
    );
};

export default ErrorPopup;
