/**
 * Created by pawelposel on 12/11/2016.
 */
 
import React, { Component, PropTypes } from 'react';

export default class ErrorMessage extends Component {

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

        return <div className={`ui error message ${this.props.className}`} style={{"display":(this.props.show?"block":"none")}}>
                    <div className="header">{header}</div>
                    <p>{error}</p>
                </div>
    }
}
 