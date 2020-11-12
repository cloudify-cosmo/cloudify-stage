/**
 * Created by jakubniezgoda on 05/07/2018.
 */
import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import i18n from 'i18next';
import { CopyToClipboardButton, Label, Popup } from '../basic';

export default function IdPopup({ buttonPosition, label, id, selected }) {
    const button = (
        <CopyToClipboardButton content={i18n.t('shared.idPopup.copy', `Copy {{label}}`, { label })} text={id} />
    );

    return (
        <Popup wide hoverable position="right center">
            <Popup.Trigger>
                <Label style={{ opacity: selected ? '1' : '0.2' }}>{label}</Label>
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
    label: PropTypes.string,
    id: PropTypes.string,
    selected: PropTypes.bool,
    buttonPosition: PropTypes.oneOf(_.keys(IdPopup.buttonPositions))
};

IdPopup.defaultProps = {
    label: i18n.t('shared.idPopup.defaultLabel', 'ID'),
    id: '',
    selected: true,
    buttonPosition: 'left'
};
