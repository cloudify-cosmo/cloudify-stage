/**
 * Created by jakubniezgoda on 05/07/2018.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { CopyToClipboardButton, Label, Popup } from '../basic';

export default function IdPopup({ buttonPosition, label, id, selected }) {
    return (
        <Popup wide hoverable position="right center">
            <Popup.Trigger>
                <Label style={{ opacity: selected ? '1' : '0.2' }}>{label}</Label>
            </Popup.Trigger>
            <Popup.Content>
                <div className="noWrap">
                    {buttonPosition === IdPopup.buttonPositions.left ? (
                        <>
                            <CopyToClipboardButton content={`Copy ${label}`} text={id} />
                            <strong style={{ marginLeft: 5 }}>{id}</strong>
                        </>
                    ) : (
                        <>
                            <strong style={{ marginRight: 5 }}>{id}</strong>
                            <CopyToClipboardButton content={`Copy ${label}`} text={id} />
                        </>
                    )}
                </div>
            </Popup.Content>
        </Popup>
    );
}

IdPopup.buttonPositions = Object.freeze({
    right: 'right',
    left: 'left'
});

IdPopup.propTypes = {
    label: PropTypes.string,
    id: PropTypes.string,
    selected: PropTypes.bool,
    buttonPosition: PropTypes.oneOf(_.keys(IdPopup.buttonPositions))
};

IdPopup.defaultProps = {
    label: 'ID',
    id: '',
    selected: true,
    buttonPosition: 'left'
};
