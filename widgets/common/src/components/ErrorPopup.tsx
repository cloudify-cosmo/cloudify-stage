import type { FunctionComponent } from 'react';
import type { PopupProps } from 'semantic-ui-react';
import styled from 'styled-components';

const { Popup, CancelButton } = Stage.Basic;

// TODO: Reuse colors from the semantic-ui library or from the aplication theming
const StyledPopup = styled(Popup)`
    && {
        color: #99392d;
        border-color: #e0b4b4;

        &,
        &&::before {
            background-color: #fff6f6;
        }

        &::before {
            box-shadow: 1px 1px 0 0 #e0b4b4;
        }
    }
`;

export interface ErrorPopupProps {
    open: PopupProps['open'];
    trigger: PopupProps['trigger'];
    errorMessage?: string;
    onDismiss: () => void;
}

// TODO: Implement closing button
// TODO: Implement max height for the error message, combined with a scrolling mechanism
const ErrorPopup: FunctionComponent<ErrorPopupProps> = ({ open, trigger, errorMessage, onDismiss }) => {
    return (
        <StyledPopup
            open={open}
            trigger={trigger}
            content={
                <div>
                    {errorMessage}
                    <CancelButton onClick={onDismiss} />
                </div>
            }
            header="Error has occured"
        />
    );
};

export default ErrorPopup;
