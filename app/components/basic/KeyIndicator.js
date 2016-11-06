/**
 * Created by pawelposel on 03/11/2016.
 */

import React, { Component, PropTypes } from 'react';

export default class KeyIndicator extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        number: PropTypes.number.isRequired
    };

    static defaultProps = {
        title: 'Not defined',
        icon: 'warning circle',
        number: 0
    };

    render() {
        return (
            <div className="keyIndicator">
                <div className="ui statistic">
                    <div className="value">
                        <i className={this.props.icon + " icon"}></i> {this.props.number}
                    </div>
                    <div className="label">
                        {this.props.title}
                    </div>
                </div>
            </div>
        );
    }
}
 