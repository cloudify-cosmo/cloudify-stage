/**
 * Created by pawelposel on 12/11/2016.
 */

import PropTypes from 'prop-types';

import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';

/**
 * ErrorMessage is a component which uses [Message](https://react.semantic-ui.com/elements/message) component from Semantic-UI-React
 * to display error message.
 *
 * ## Access
 * `Stage.Basic.ErrorMessage`
 *
 * ## Usage
 * ### Single error message
 * ![ErrorMessage](manual/asset/ErrorMessage_0.png)
 * ```
 * <ErrorMessage header="Fatal error" error="File cannot be opened" />
 * ```
 *
 * ### List of error messages
 * ![ErrorMessage](manual/asset/ErrorMessage_1.png)
 * ```
 * <ErrorMessage header="Errors in the form"
 *               error=["Please provide deployment name", "Please provide agent_private_key_path"] />
 * ```
 *
 */
export default class ErrorMessage extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            hidden: false
        };

        this.visibilityTimeout = null;
    }

    /**
     * propTypes
     * @property {boolean} [autoHide=false] if set, then message will be hidden after visibility timeout
     * @property {string} [className=''] additional CSS classes to [Message](https://react.semantic-ui.com/elements/message) component
     * @property {object} [error=null] string, array or object containing error text message/messages
     * @property {string} [header='Error Occured'] header of error text message
     * @property {function} [onDismiss=()=>{}] function called when either error message visibility timeout (see {@link ErrorMessage.MESSAGE_VISIBLE_TIMEOUT}) expires or user dismiss manually error message
     */
    static propTypes = {
        autoHide: PropTypes.bool,
        className: PropTypes.string,
        error: PropTypes.any,
        header: PropTypes.string,
        onDismiss: PropTypes.func
    };

    static defaultProps = {
        autoHide: false,
        className: '',
        error: null,
        header: 'Error Occured',
        onDismiss: () => {}
    };

    /**
     * Message visibility timeout
     */
    static MESSAGE_VISIBLE_TIMEOUT = 10000;

    componentDidUpdate(prevProps) {
        if (!!this.props.error && !_.isEqual(this.props.error, prevProps.error)) {
            this.setState({hidden: false});
            if (this.props.error) {
                this._setVisibilityTimeout(ErrorMessage.MESSAGE_VISIBLE_TIMEOUT);
            }
        }
    }

    componentDidMount() {
        this._setVisibilityTimeout(ErrorMessage.MESSAGE_VISIBLE_TIMEOUT);
    }

    componentWillUnmount() {
        clearTimeout(this.visibilityTimeout);
    }

    _setVisibilityTimeout(timeout) {
        if (this.props.autoHide) {
            clearTimeout(this.visibilityTimeout);
            this.visibilityTimeout = setTimeout(() => {
                this._handleDismiss();
            }, timeout)
        }
    }

    _handleDismiss() {
        this.setState({hidden: true});
        this.props.onDismiss();
    }

    render() {
        if (!this.props.error) {
            return null;
        }

        var error = this.props.error;
        var header = this.props.header;

        if (!_.isString(error) && !_.isArray(error)) {
            error = this.props.error.message;

            if (!header) {
                header = this.props.error.header;
            }
        }

        return (
            <Message error className={this.props.className}
                     hidden={this.state.hidden} onDismiss={this._handleDismiss.bind(this)}>
                <Message.Header>{header}</Message.Header>
                {
                    _.isArray(error) && !_.isEmpty(error)
                    ? <Message.List items={error} />
                    : <Message.Content>{error}</Message.Content>
                }
            </Message>
        )
    }
}
 