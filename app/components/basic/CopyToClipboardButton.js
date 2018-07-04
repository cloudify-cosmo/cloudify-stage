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
    }

    /**
     * @property {string} text Text to be copied to clipboard
     * @property {string} [content=''] Button label
     * @property {string} [className=''] Class name to be added to button component
     */
    static propTypes = {
        text: PropTypes.string.isRequired,
        content: PropTypes.string,
        className: PropTypes.string
    };

    static defaultProps = {
        content: '',
        className: ''
    };

    render() {
        return (
            <CopyToClipboard text={this.props.text}>
                {
                    this.props.content
                    ?
                        <Button animated='vertical' basic compact className={this.props.className}>
                            <Button.Content visible>{this.props.content}</Button.Content>
                            <Button.Content hidden><Icon name='copy' /></Button.Content>
                        </Button>
                    :
                        <Button basic compact icon='copy' className={this.props.className} />
                }


            </CopyToClipboard>
        )
    };
};