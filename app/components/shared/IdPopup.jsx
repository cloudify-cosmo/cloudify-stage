/**
 * Created by jakubniezgoda on 05/07/2018.
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { CopyToClipboardButton, Label, Popup } from '../basic';

export default function IdPopup({ buttonPosition, id, selected }) {
    const button = <CopyToClipboardButton content={i18n.t('shared.idPopup.copyButton')} text={id} />;

    return (
        <Popup wide hoverable position="right center">
            <Popup.Trigger>
                <Label style={{ opacity: selected ? '1' : '0.2' }}>{i18n.t('shared.idPopup.label')}</Label>
            </Popup.Trigger>
            <Popup.Content>
                <div className="noWrap">
                    {buttonPosition === IdPopup.buttonPositions.left ? (
                        <>
                            {button}
                            <strong style={{ marginLeft: 5 }}>{id}</strong>
                        </>
                    ) : (
                        <>
                            <strong style={{ marginRight: 5 }}>{id}</strong>
                            {button}
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
    id: PropTypes.string,
    selected: PropTypes.bool,
    buttonPosition: PropTypes.oneOf(_.keys(IdPopup.buttonPositions))
};

IdPopup.defaultProps = {
    id: '',
    selected: true,
    buttonPosition: 'left'
};
