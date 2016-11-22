/**
 * Created by pawelposel on 2016-11-18.
 */

import React, { Component, PropTypes } from 'react';

export default class Checkmark extends Component {

    static propTypes = {
        value: PropTypes.bool.isRequired
    };

    static defaultProps = {
        value: false
    };

    render() {
        return (
            this.props.value ?
            <i className="checkmark box icon grey" title="Yes"/>
            :
            <i className="square outline icon grey" title="No"/>
        );
    }
}
