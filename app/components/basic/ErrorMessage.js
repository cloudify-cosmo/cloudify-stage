/**
 * Created by pawelposel on 12/11/2016.
 */
 
import React, { Component, PropTypes } from 'react';

export default class ErrorMessage extends Component {

    static propTypes = {
        header: PropTypes.string,
        error: PropTypes.string,
        className: PropTypes.string,
        show: PropTypes.bool
    };

    static defaultProps = {
        header: 'Error Occured',
        show: true
    };

    render() {
        if (!this.props.error) {
            return null;
        }

        return <div className={`ui error message ${this.props.className}`} style={{"display":(this.props.show?"block":"none")}}>
                    <div className="header">{this.props.header}</div>
                    <p>{this.props.error}</p>
                </div>
    }
}
 