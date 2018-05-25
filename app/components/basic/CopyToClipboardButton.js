/**
 * Created by jakubniezgoda on 25/05/2018.
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Icon, Popup } from './index';

/**
 * CopyToClipboardButton component shows a simple copy icon and on click action it copies prop - text to clipboard
 *
 * ## Access
 * `Stage.Basic.CopyToClipboardButton`
 *
 * ## Usage
 *
 * ![CopyToClipboardButton](manual/asset/CopyToClipboardButton_0.png)
 * ```
 * <CopyToClipboardButton text='Text to copy' />
 *```
 */
export default class CopyToClipboardButton extends Component {

    constructor(props,context) {
        super(props,context);

        this.state = {
            copied: false
        }
    }

    /**
     * @property {string} text Text to be copied to clipboard
     */
    static propTypes = {
        text: PropTypes.string.isRequired
    };

    static TIMEOUT_LENGTH = 2000;

    handleCopy() {
        this.setState({ copied: true });

        this.timeout = setTimeout(() => {
            this.setState({ copied: false })
        }, CopyToClipboardButton.TIMEOUT_LENGTH)
    };

    handleClose() {
        this.setState({ copied: false });
        clearTimeout(this.timeout)
    };

    render() {
        return (
            <Popup onClose={this.handleClose.bind(this)}>
                <Popup.Trigger>
                    <span style={{margin: '5px'}}>
                        <CopyToClipboard text={this.props.text}>
                            <Icon name='copy' link onClick={this.handleCopy.bind(this)} />
                        </CopyToClipboard>
                    </span>
                </Popup.Trigger>
                <Popup.Content>
                    {this.state.copied ? 'Copied to clipboard' : 'Click to copy'}
                </Popup.Content>
            </Popup>
        )
    };
};