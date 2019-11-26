/**
 * Created by jakubniezgoda on 05/07/2018.
 */
import PropTypes from 'prop-types';
import React from 'react';
import { Label } from 'semantic-ui-react';
import CopyToClipboardButton from './CopyToClipboardButton';
import Popup from './Popup';

export default class IdPopup extends React.Component {
    static buttonPositions = Object.freeze({
        right: 'right',
        left: 'left'
    });

    static propTypes = {
        label: PropTypes.string,
        id: PropTypes.string,
        selected: PropTypes.bool,
        buttonPosition: PropTypes.oneOf(_.keys(IdPopup.buttonPositions))
    };

    static defaultProps = {
        label: 'ID',
        id: '',
        selected: true,
        buttonPosition: 'left'
    };

    render() {
        return (
            <Popup wide hoverable position="right center">
                <Popup.Trigger>
                    <Label style={{ opacity: this.props.selected ? '1' : '0.2' }}>{this.props.label}</Label>
                </Popup.Trigger>
                <Popup.Content>
                    <div className="noWrap">
                        {this.props.buttonPosition === IdPopup.buttonPositions.left ? (
                            <>
                                <CopyToClipboardButton content={`Copy ${this.props.label}`} text={this.props.id} />
                                &nbsp;&nbsp;
                                <strong>{this.props.id}</strong>
                            </>
                        ) : (
                            <>
                                <strong>{this.props.id}</strong>
                                &nbsp;&nbsp;
                                <CopyToClipboardButton content={`Copy ${this.props.label}`} text={this.props.id} />
                            </>
                        )}
                    </div>
                </Popup.Content>
            </Popup>
        );
    }
}
