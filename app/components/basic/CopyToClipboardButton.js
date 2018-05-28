/**
 * Created by jakubniezgoda on 25/05/2018.
 */

import PropTypes from 'prop-types';
import { Component } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Button, Icon } from './index';

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
 * <CopyToClipboardButton text='Text to copy' content='Copy ID' />
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
     * @property {string} [content='Copy to clipboard'] Button label
     */
    static propTypes = {
        text: PropTypes.string.isRequired,
        content: PropTypes.string
    };

    static defaultProps = {
        content: 'Copy to clipboard'
    }

    render() {
        return (
            <CopyToClipboard text={this.props.text}>
                <Button animated='vertical' basic compact>
                    <Button.Content visible>{this.props.content}</Button.Content>
                    <Button.Content hidden><Icon name='copy' /></Button.Content>
                </Button>
            </CopyToClipboard>
        )
    };
};