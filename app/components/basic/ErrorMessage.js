/**
 * Created by pawelposel on 12/11/2016.
 */
 
import React, { Component, PropTypes } from 'react';
import { Message } from 'semantic-ui-react';

/**
 * ErrorMessage is a component which uses [Message](https://react.semantic-ui.com/elements/message) component from Semantic-UI-React
 * to display error message.
 *
 * ## Usage
 * ![ErrorMessage](manual/asset/ErrorMessage_0.png)
 * ```
 * <ErrorMessage header="Fatal error" error="File cannot be opened" />
 * ```
 *
 */
export default class ErrorMessage extends Component {

    /**
     * propTypes
     * @property {string} [header='Error Occured'] header of error text message
     * @property {object} [error] string or object containing error text message/messages
     * @property {boolean} [show=true] specifies if error message shall be shown
     * @property {string} [className=''] additional CSS classes to [Message](https://react.semantic-ui.com/elements/message) component
     */
    static propTypes = {
        header: PropTypes.string,
        error: PropTypes.any,
        className: PropTypes.string,
        show: PropTypes.bool
    };

    static defaultProps = {
        header: 'Error Occured',
        show: true,
        className: ""
    };

    render() {
        if (_.isEmpty(this.props.error)) {
            return null;
        }

        var error = this.props.error;
        var header = this.props.header;
        if (!_.isString(this.props.error)) {
            error = this.props.error.message;

            if (!header) {
                header = this.props.error.header;
            }
        }

        return (
            <Message error className={this.props.className} visible={this.props.show}>
                <Message.Header>{header}</Message.Header>
                <p>{error}</p>
            </Message>
        )
    }
}
 